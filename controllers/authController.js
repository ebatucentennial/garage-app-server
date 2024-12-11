const Seller = require('../models/Seller');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Login Seller
exports.loginSeller = async (req, res) => {
    const { identifier, password } = req.body; // identifier can be username or email

    try {
        // Find seller by username or email
        const seller = await Seller.findOne({
            $or: [{ username: identifier }, { email: identifier }],
        });

        if (!seller) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, seller.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: seller._id, username: seller.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, seller });
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Register Seller
exports.registerSeller = async (req, res) => {
    const { username, email, phoneNumber, firstName, lastName, password } = req.body;

    try {
        // Check if username or email already exists
        const existingSeller = await Seller.findOne({
            $or: [{ username }, { email }],
        });
        if (existingSeller) {
            return res.status(400).json({ error: 'Username or Email already exists' });
        }

        // Create new seller
        const newSeller = new Seller({ username, email, phoneNumber, firstName, lastName, password });
        await newSeller.save();

        res.status(201).json({ message: 'Seller registered successfully' });
    } catch (error) {
        console.error('Error registering seller:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};


// Get the logged-in user's profile
exports.getProfile = async (req, res) => {
    try {
        const user = req.user;
        // Return user data
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching profile:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update the logged-in user's profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const { username, email, phoneNumber, firstName, lastName, password } = req.body;

        // Find the current user
        const seller = await Seller.findById(userId);
        if (!seller) {
            return res.status(404).json({ error: 'User not found' });
        }

        // If username changed, ensure it's not taken
        if (username && username !== seller.username) {
            const existingUser = await Seller.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ error: 'Username already exists' });
            }
            seller.username = username;
        }

        // If email changed, ensure it's not taken
        if (email && email !== seller.email) {
            const existingEmail = await Seller.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ error: 'Email already exists' });
            }
            seller.email = email;
        }

        // Update other fields
        if (phoneNumber) seller.phoneNumber = phoneNumber;
        if (firstName) seller.firstName = firstName;
        if (lastName) seller.lastName = lastName;

        // If password changed, hash it
        if (password && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            seller.password = await bcrypt.hash(password, salt);
        }

        // Save changes
        await seller.save();
        
        // Return updated user (excluding password)
        const updatedUser = await Seller.findById(userId).select('-password');
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating profile:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

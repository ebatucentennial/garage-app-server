const GarageSale = require('../models/GarageSale');
const jwt = require('jsonwebtoken');
const Seller = require('../models/Seller');
const Item = require('../models/Item');

// Fetch all active garage sales
exports.getActiveGarageSales = async (req, res) => {
    try {
        const { currentDate } = req.query;

        const garageSales = await GarageSale.find({
            startDate: { $lte: new Date(currentDate) },
            endDate: { $gte: new Date(currentDate) },
        });

        res.status(200).json(garageSales);
    } catch (error) {
        console.error('Error fetching active garage sales:', error.message);
        res.status(500).json({ error: 'Failed to fetch active garage sales' });
    }
};

// Add a new garage sale
exports.addGarageSale = async (req, res) => {
    try {
        let sellerId = null;

        // Attempt to extract and verify token if provided
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await Seller.findById(decoded.id).select('_id');
                if (user) {
                    sellerId = user._id;
                }
            } catch (error) {
                console.error('Error verifying optional token:', error.message);
                // If token is invalid, we just leave sellerId as null
            }
        }

        const newGarageSaleData = {
            title: req.body.title,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            createdDate: req.body.startDate,
            updatedDate: req.body.startDate,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            postalCode: req.body.postalCode,
            address: req.body.address,
            sellerId: sellerId,
        };

        const newGarageSale = await GarageSale.create(newGarageSaleData);
        res.status(201).json(newGarageSale);
    } catch (error) {
        console.error('Error adding garage sale:', error.message);
        res.status(400).json({ error: 'Failed to add garage sale' });
    }
};

// Fetch garage sales by seller ID (requires authentication)
exports.getGarageSalesBySeller = async (req, res) => {
    try {
        const sellerId = req.user.id; // Retrieved from JWT middleware
        const garageSales = await GarageSale.find({ sellerId });

        res.status(200).json(garageSales);
    } catch (error) {
        console.error('Error fetching garage sales:', error.message);
        res.status(500).json({ error: 'Failed to fetch garage sales' });
    }
};

// Fetch a single garage sale by ID (requires authentication)
exports.getGarageSaleById = async (req, res) => {
    try {
        const { id } = req.params;
        const garageSale = await GarageSale.findById(id);

        if (!garageSale) {
            return res.status(404).json({ error: 'Garage sale not found' });
        }

        res.status(200).json(garageSale);
    } catch (error) {
        console.error('Error fetching garage sale:', error.message);
        res.status(500).json({ error: 'Failed to fetch garage sale' });
    }
};

// Update a garage sale (requires authentication)
exports.updateGarageSale = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedGarageSale = await GarageSale.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedGarageSale) {
            return res.status(404).json({ error: 'Garage sale not found' });
        }

        res.status(200).json(updatedGarageSale);
    } catch (error) {
        console.error('Error updating garage sale:', error.message);
        res.status(500).json({ error: 'Failed to update garage sale' });
    }
};

// Delete a garage sale (requires authentication)
exports.deleteGarageSale = async (req, res) => {
    try {
        const { id } = req.params;

        const garageSale = await GarageSale.findById(id);
        if (!garageSale) {
            return res.status(404).json({ error: 'Garage sale not found' });
        }

        if (garageSale.sellerId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to delete this garage sale' });
        }

        // Delete all items associated with the garage sale
        await Item.deleteMany({ garageSaleId: id });

        // Delete the garage sale
        await GarageSale.findByIdAndDelete(id);

        res.status(200).json({ message: 'Garage sale and associated items deleted successfully' });
    } catch (error) {
        console.error('Error deleting garage sale:', error.message);
        res.status(500).json({ error: 'Failed to delete garage sale' });
    }
};

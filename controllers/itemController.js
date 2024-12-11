const Item = require('../models/Item');

// Fetch all items for a garage sale
exports.getItemsByGarageSale = async (req, res) => {
    try {
        const { garageSaleId } = req.params;
        const items = await Item.find({ garageSaleId });
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching items:', error.message);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
};

// Add a new item
exports.addItem = async (req, res) => {
    try {
        const { name, description, price, garageSaleId } = req.body;
        const imageUrl = req.file ? req.file.path : '';

        const newItem = await Item.create({
            garageSaleId,
            name,
            description,
            price,
            image: imageUrl
        });
        
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error adding item:', error.message);
        res.status(400).json({ error: 'Failed to add item' });
    }
};

// Update an item
exports.updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const imageUrl = req.file ? req.file.path : undefined;
        const updateFields = { ...req.body };
        if (imageUrl) updateFields.image = imageUrl;

        const updatedItem = await Item.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error('Error updating item:', error.message);
        res.status(500).json({ error: 'Failed to update item' });
    }
};

// Delete an item
exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await Item.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error.message);
        res.status(500).json({ error: 'Failed to delete item' });
    }
};

// Search Items by query
exports.searchItems = async (req, res) => {
    const { query } = req.query;
    try {
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        const items = await Item.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }).populate('garageSaleId', 'title');

        res.status(200).json(items);
    } catch (error) {
        console.error('Error searching items:', error.message);
        res.status(500).json({ error: 'Failed to search items' });
    }
};

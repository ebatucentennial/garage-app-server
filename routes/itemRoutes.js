const express = require('express');
const Item = require('../models/Item');
const { protect } = require('../middleware/authMiddleware');
const {
    getItemsByGarageSale,
    addItem,
    updateItem,
    deleteItem,
} = require('../controllers/itemController');

const router = express.Router();

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'garage_sale_items',
    allowed_formats: ['jpeg', 'png', 'jpg']
  }
});

const upload = multer({ storage });

router.get('/search', async (req, res) => {
    const { query } = req.query;
    try {
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        // Case-insensitive search on name or description
        const items = await Item.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
            ]
        }).populate('garageSaleId', 'title');

        res.status(200).json(items);
    } catch (error) {
        console.error('Error searching items:', error.message);
        res.status(500).json({ error: 'Failed to search items' });
    }
});

// Routes for managing items
router.get('/:garageSaleId', getItemsByGarageSale); 
router.post('/', protect, upload.single('image'), addItem);
router.put('/:id', protect, upload.single('image'), updateItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;

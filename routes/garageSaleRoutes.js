const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    getActiveGarageSales,
    addGarageSale,
    getGarageSalesBySeller,
    getGarageSaleById,
    updateGarageSale,
    deleteGarageSale
} = require('../controllers/garageSaleController');

const router = express.Router();

// Route to get all active garage sales
router.get('/active-garage-sales', getActiveGarageSales);

// Route to fetch garage sales by seller ID (requires auth)
router.get('/seller', protect, getGarageSalesBySeller);

// Fetch a single garage sale by ID (public or requires auth?)
router.get('/:id', getGarageSaleById);

// Route to add a new garage sale (no auth required)
router.post('/', addGarageSale);

// Route to update a garage sale (requires auth)
router.put('/:id', protect, updateGarageSale);

// Route to delete a garage sale (requires auth)
router.delete('/:id', protect, deleteGarageSale);

module.exports = router;

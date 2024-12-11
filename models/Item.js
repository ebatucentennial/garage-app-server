const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    garageSaleId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'GarageSale', 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    price: { 
        type: Number, 
        required: true 
    },
    image: { 
        type: String 
    },
    createdDate: { 
        type: Date, 
        default: Date.now 
    },
    updatedDate: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Item', ItemSchema);

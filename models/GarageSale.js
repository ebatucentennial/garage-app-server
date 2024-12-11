const mongoose = require('mongoose');

const GarageSaleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', default: null },
    postalCode: { type: String },
    address: { type: String, required: true }
});

module.exports = mongoose.model('GarageSale', GarageSaleSchema);

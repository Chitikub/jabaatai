const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    locationId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true // 'forest' or 'sea'
    },
    description: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index สำหรับ userId และ locationId เพื่อหลีกเลี่ยง duplicate
favoriteSchema.index({ userId: 1, locationId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);

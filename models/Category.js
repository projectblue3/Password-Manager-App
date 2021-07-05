const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A title is needed'],
        trim: true,
        unique: true,
    },
    icon: {
        type: String,
    },
    color: {
        type: String,
        default: '#ffffff',
    },
});

module.exports = mongoose.model('Category', CategorySchema);

const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const PasswordSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A title is needed'],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: '60cfcff452af4919948f5610',
    },
    username: {
        type: String,
    },
    password: {
        type: String,
        required: [true, 'A password is needed'],
    },
    note: {
        type: String,
    },
});

/*
PasswordSchema.plugin(encrypt, {
    secret: process.env.SECRET_KEY,
    encryptedFields: ['title', 'username', 'password', 'note'],
});
*/

module.exports = mongoose.model('Password', PasswordSchema);

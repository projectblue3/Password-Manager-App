const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'An email is needed'],
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    username: {
        type: String,
        required: [true, 'A username is needed'],
        trim: true,
        unique: true,
        lowercase: true,
        minLength: 2,
        maxLength: 16,
    },
    password: {
        type: String,
        required: [true, 'A password is needed'],
        trim: true,
        //minLength: 8,
        //maxLength: 256,
        //match: [/^(?!.* )(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-!@#\$%\^&\*])/, 'Invalid Password'],
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', UserSchema);

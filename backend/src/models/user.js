const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: [true, 'Username field is required.']
    },
    password: {
        type: String,
        required: [true, 'Password field is required.']
    },
    email: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
    },
});

// Creating a table within database with the defined schema
const User = mongoose.model('user', UserSchema);

// Exporting table for querying and mutating
module.exports = User;

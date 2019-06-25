const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    post: {
        type: String,
        required: true,
    },
    like: {
        type: Boolean,
        required: true,
    }
});

// Creating a table within database with the defined schema
const Like = mongoose.model('like', LikeSchema);

// Exporting table for querying and mutating
module.exports = Like;

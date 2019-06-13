const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    post: {
        type: String,
        required: true,
    }
});

// Creating a table within database with the defined schema
const Comment = mongoose.model('comment', CommentSchema);

// Exporting table for querying and mutating
module.exports = Comment;

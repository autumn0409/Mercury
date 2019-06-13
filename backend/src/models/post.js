const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    published: {
        type: Boolean,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
});

// Creating a table within database with the defined schema
const Post = mongoose.model('post', PostSchema);

// Exporting table for querying and mutating
module.exports = Post;

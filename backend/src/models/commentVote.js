const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentVoteSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    like: {
        type: Boolean,
        required: true,
    }
});

// Creating a table within database with the defined schema
const CommentVote = mongoose.model('commentVote', CommentVoteSchema);

// Exporting table for querying and mutating
module.exports = CommentVote;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    }
});

// Creating a table within database with the defined schema
const Sub = mongoose.model('sub', SubSchema);

// Exporting table for querying and mutating
module.exports = Sub;

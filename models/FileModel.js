const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema({
    filename: {
        type: String,
        required: [true, "File name must be given"]
    },
    path: {
        type: String,
        required: [true, "Path must be given"]
    },
    size: {
        type: Number,
        required: [true, "Size must be given"]
    },
    uuid: {
        type: String,
        required: [true, "File name must be given"]
    },
    sender: {
        type: String
    },
    receiver: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('file' , FileSchema);
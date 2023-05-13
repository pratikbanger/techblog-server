const mongoose = require('mongoose');
const { Schema } = mongoose;

const BlogSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    files: {
        type: String
    }
}, {
    timestamps: true,
})

const Blog = mongoose.model('blog', BlogSchema);
module.exports = Blog;
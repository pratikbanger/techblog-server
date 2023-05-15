const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');

// Schemas
const Blog = require('../models/Blogs');

// ROUTE 1: Create a new blog using: POST "/api/blog/addblog".
router.post('/addblog', fetchuser, [
    body('title', 'Title must be atleast 3 character').isLength({ min: 3 }),
    body('summary', 'Summary must be atleast 5 character').isLength({ min: 5 }),
    body('content', 'Content must be atleast 5 character').isLength({ min: 5 }),
], async (req, res) => {

    // If there are any error while validation it will return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Destructuring from body
        const { title, summary, content, files } = req.body

        const newBlog = new Blog({
            title,
            summary,
            content,
            files,
            user: req.user.id
        })

        const savedBlog = await newBlog.save();

        let success = true
        let message = "Blog created successfully, Redirecting to Home Page!"
        res.json({ success, message });

    } catch (error) {
        console.error(error.message);
        let success = false
        let message = "Internal Server error"
        res.status(500).send({ success, message });
    }
})

// ROUTE 2: Fetch all blog using: GET "/api/blog/getblogs".
router.get('/getblogs', async (req, res) => {
    try {
        let page = Number(req.query.page) || 1
        let limit = Number(req.query.limit) || 3
        let skip = (page - 1) * limit

        const allBlogs = await Blog.find()
            .populate('user', ['username'])
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);
        res.json({ totalResults: allBlogs.length, allBlogs })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error!")
    }
})

// ROUTE 3: Fetch users blogs only using: GET "/api/blog/myblogs".
router.get('/myblogs', fetchuser, async (req, res) => {
    try {
        let page = Number(req.query.page) || 1
        let limit = Number(req.query.limit) || 3
        let skip = (page - 1) * limit

        const myBlogs = await Blog.find({ user: req.user.id })
            .populate('user', ['username', 'isAdmin'])
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        res.json({ totalResults: myBlogs.length, myBlogs })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error!")
    }
})

// ROUTE 4: Fetch particular blogs by ID using: GET "/api/blog/:id".
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const blogByID = await Blog.findById(id)
            .populate('user', ['username'])
        res.send(blogByID);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error!")
    }
})

// ROUTE 5: Update blog using: PUT "/api/blog/updateblog".
router.put('/updateblog/:id', fetchuser, async (req, res) => {
    try {
        // Destructuring from body
        const { id, title, summary, content, files } = req.body
        const updateBlog = await Blog.findById(id);

        await updateBlog.updateOne({
            title,
            summary,
            content,
            files,
        })
        res.json(updateBlog);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error");
    }
})

// ROUTE 6: Delete blog using: DELETE "/api/blog/deleteblog".
router.delete('/deleteblog/:id', fetchuser, async (req, res) => {
    try {
        // Destructuring from body
        const { id } = req.params
        const deleteBlog = await Blog.findById(id);

        await deleteBlog.deleteOne()
        res.json("Blog has been deleted successfully!");

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error");
    }
})

// ROUTE 2: Fetch all blog using: GET "/api/blog/getblogs".
router.post('/searchblogs', async (req, res) => {
    try {
        const query = req.body.keyword

        const allBlogs = await Blog.find({
            $or: [{ title: { "$regex": query } }]
        })
        // .populate('user', ['username'])
        // .sort({ createdAt: -1 })
        res.json(allBlogs)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error!")
    }
})

module.exports = router
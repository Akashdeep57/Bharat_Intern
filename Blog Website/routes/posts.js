const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { ensureAuthenticated } = require('../middleware/auth');

// Show form to create a new post
router.get('/create', ensureAuthenticated, (req, res) => {
    res.render('create-post');
});

// Create a new post
router.post('/create', ensureAuthenticated, async (req, res) => {
    try {
        const { title, body } = req.body;
        const newPost = new Post({
            title,
            body,
            author: req.user._id
        });
        await newPost.save();
        res.redirect('/');
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Show form to edit a post
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.author.equals(req.user._id)) {
            res.render('edit-post', { post });
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.error('Error fetching post:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Update a post
router.post('/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        const { title, body } = req.body;
        const post = await Post.findById(req.params.id);
        if (post.author.equals(req.user._id)) {
            post.title = title;
            post.body = body;
            await post.save();
            res.redirect('/');
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.error('Error updating post:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Delete a post
router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if (post.author.equals(req.user._id)) {
            await post.remove();
            res.redirect('/');
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

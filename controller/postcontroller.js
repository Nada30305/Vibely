
const Post = require('../model/post');
const User = require('../model/user');

// Create Post
const createPost = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                message: 'Post content is required'
            });
        }

        const newPost = await Post.create({
            content: content.trim(),
            userId: req.user.id
        });

        const post = await Post.findByPk(newPost.id, {
            include: [{
                model: User,
                attributes: ['id', 'username']
            }]
        });

        return res.status(201).json({
            message: 'Post created successfully!',
            post
        });

    } catch (error) {
        console.error('Create post error:', error);

        return res.status(500).json({
            message: 'Server error'
        });
    }
};

// Get All Posts
const getPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [{
                model: User,
                attributes: ['id', 'username']
            }],
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json({
            posts
        });

    } catch (error) {
        console.error('Get posts error:', error);

        return res.status(500).json({
            message: 'Server error'
        });
    }
};

// Delete Post
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findByPk(id);

        if (!post) {
            return res.status(404).json({
                message: 'Post not found'
            });
        }

        if (post.userId !== req.user.id) {
            return res.status(403).json({
                message: 'You cannot delete this post'
            });
        }

        await post.destroy();

        return res.status(200).json({
            message: 'Post deleted successfully!'
        });

    } catch (error) {
        console.error('Delete post error:', error);

        return res.status(500).json({
            message: 'Server error'
        });
    }
};

module.exports = {
    createPost,
    getPosts,
    deletePost
};

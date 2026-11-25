const express = require('express');
const router = express.Router();

const {
    createPost,
    getPosts,
    deletePost
} = require('../controller/postcontroller');

const verifyToken = require('../middelware/authMiddleware');

router.get('/', getPosts);
router.post('/', verifyToken, createPost);
router.delete('/:id', verifyToken, deletePost);

module.exports = router;
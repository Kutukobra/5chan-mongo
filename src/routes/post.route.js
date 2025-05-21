const postController = require('../controllers/post.controller');
const { canDeletePost, canEditPost } = require('../middleware/post.middleware');
const express = require('express');
const router = express.Router();
const multer = require('multer');

const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const rateLimit = require('express-rate-limit');
const { authenticate, authorize } = require('../middleware/auth.middleware');

cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: '5chan',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'svg', 'webp']
    }
});


const upload = multer({storage});

router.post('/', upload.single('file'), postController.createPost);

router.get('/:id', postController.getPostById);

router.get('/forUser/:userId', postController.getPostsForUser);

router.put('/', authenticate, authorize('user'), canEditPost, postController.editPost);

router.delete('/', authenticate, authorize('admin', 'user'), canDeletePost, postController.deletePost);

module.exports = router;
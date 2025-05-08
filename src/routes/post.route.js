const postController = require('../controllers/post.controller');
const express = require('express');
const router = express.Router();
const multer = require('multer');

const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const rateLimit = require('express-rate-limit');


cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'sbd',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'svg', 'webp']
    }
});

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 5, // 10 / 10 minute
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
})

const upload = multer({storage});

router.post('/new', limiter, upload.single('file'), postController.createPost);

router.get('/', postController.getPosts);

router.get('/:id', postController.getReplies);

// router.delete('/', postController.getPosts);

module.exports = router;
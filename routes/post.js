const express = require('express');
const multer = require('multer');
const publicDir = require('../public/js/publicDir');
const path = require('path');
const router = express.Router();
const { Post, Hashtag, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

// Create folder path
publicDir.mkdirp(process.env.PUBLIC_UPLOAD);

const upload = multer({
    storage: multer.diskStorage({
        destination(_req, _file, callback) {
            callback(null, process.env.PUBLIC_UPLOAD);
        },
        filename(_req, file, callback) {
            const ext = path.extname(file.originalname);
            callback(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limit: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    res.json({ url: `/img/${req.file.filename}` });
});

router.delete('/img/:imgname', (req, res, next) => {
    if (publicDir.deleteFile(process.env.PUBLIC_UPLOAD, req.params.imgname)) {
        res.status(200).send('DELETE OK');
    }
    else {
        res.status(500).send('DELETE ERROR');
    }
});

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            userId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        if (hashtags) {
            const new_Create_Hashtags_Arr = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
                where: { title: tag.slice(1).toLowerCase() },
            })));
            await post.addPostHashtag_Hashtag(new_Create_Hashtags_Arr.map(find_HashtagId => find_HashtagId[0].id));
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/hashtag', async (req, res, next) => {
    const query = req.query.hashtag;
    if (!query) {
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.findOne({ where: { title: query } });
        let posts = [];
        if (hashtag) {
            posts = await hashtag.getPostHashtag_Post({ include: [{ model: User, as: "User" }] });
        }
        return res.render('main', {
            title: `${query} | GoFlight`,
            user: req.user,
            twits: posts,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await Post.destroy({
            where: {
                id: req.params.id,
                userId: req.user.id,
            },
        });
        res.status(200).send('Post_Delete_OK');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/:id/like', async (req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id } });
        await post.addLike_Liker(req.user.id);
        res.send('Post_Like_OK');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/:id/like', async (req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id } });
        await post.removeLike_Liker(req.user.id);
        res.send('Post_Like_Delete_OK');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
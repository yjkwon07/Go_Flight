const express = require('express');

const { isLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        await user.addFollow_Followings(parseInt(req.params.id, 10));
        res.status(200).send('Follow_OK');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/:id/unfollow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        await user.removeFollow_Followers(parseInt(req.params.id, 10));
        res.status(200).send('UnFollow_OK');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/profile', async (req, res, next) => {
    try {
        await User.update({ nick: req.body.nick }, {
            where: { id: req.user.id },
        });
        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
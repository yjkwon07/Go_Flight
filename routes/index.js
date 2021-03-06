const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User } = require('../models');

router.get('/profile', isLoggedIn, (req, res) => {
    res.render("profile", {
        title: "내 정보 - GoFlight",
        user: req.user,
    });
});

router.get('/join', isNotLoggedIn, (req, res, _next) => {
    res.render("join", {
        title: "회원가입 - GoFlight",
        user: req.user,
        joinError: req.flash('joinError'),
    });
});

router.get('/', (req, res, next) => {
    Post.findAll({
        include: [{
            model: User,
            attributes: ['id', 'nick'],
            as: "User"
        },{
            model: User,
            attributes: ['id', 'nick'],
            as: 'Like_Liker'
        }],
        order: [['createdAt', 'DESC']],
    })
        .then((posts) => {
            res.render('main', {
                title: 'GoFlight',
                twits: posts,
                user: req.user,
                loginError: req.flash('loginError'),
            });
        })
        .catch((error) => {
            console.error(error);
            next(error);
        });
});

module.exports = router;
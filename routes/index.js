const express = require('express');
const router = express.Router();

// profile
router.get('/profile', (req, res) => {
     res.render("profile", {
        title: "내 정보 - GoFlight",
        user: null
     });
});

// join
router.get('/', (req, res, next) => {
    res.render("join", {
        title : "회원가입 - GoFlight",
        user:null,
        joinError: req.flash('joinError'),
    });
});

// main
router.get('/', (req, res, next) => {
    res.render('main', {
        title: "GoFlight",
        twits: [],
        user: null,
        loginError: req.flash("loginError"),
    });
});

module.exports = router;
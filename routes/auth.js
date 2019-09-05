const express = require('express');
const bcyrpt = require('bcrypt');
const passport = require('passport');
const { User } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();
// router.get(미들웨어1, 미들웨어2, 미들웨어3); 
router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        const checkUser = await User.findOne({ where: { email } });
        if (checkUser) {
            req.flash('joinError', '이미 가입된 이메일 입니다!');
            return res.redirect('/join');
        }
        // console.time('암호화 생성 시간');
        const hashPassword = await bcyrpt.hash(password, 12);
        // console.timeEnd('암호화 생성 시간');
        await User.create({
            email,
            nick : nick === null ? "익명" : nick,
            password: hashPassword,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => { 
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            req.flash('loginError', info.message);
            return res.redirect('/');
        }
        return req.login(user, (loginError) => { 
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next); 
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/');
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (_req, res) => {
    res.redirect('/');
});

module.exports = router;
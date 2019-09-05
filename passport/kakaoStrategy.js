const KakaoStrategy = require('passport-kakao').Strategy;

const { User } = require('../models');

module.exports = (passport) => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
    }, async (_acessToken, _refreshToken, profile, done) => {
        try {
            const checkUser = await User.findOne({
                where: {
                    snsId: profile.id,
                    provider: 'kakao',
                },
            });
            if (checkUser) {
                done(null, checkUser);
            } else {
                const createUser = await User.create({
                    email: profile._json && profile._json.kaccount_email,
                    nick: profile._json.properties.nickname,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, createUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const { User } = require('../models');

// const user={};

module.exports = (passport) => {
    // req.login 시에 serializeUser호출 -> 유저 정보 중 아이디만 세션에 저장 -> why?
    passport.serializeUser((user, done) => {
        /*
            {id: 12345, name: yjkwon, age: 26 } -> 12345만 저장
            세션에 모두 저장하기는 너무 무겁다.. -> 많은 사용자의 세션값을 담아야 하기 때문에
            그럼 고유값 id만 저장하자 !
        */
        done(null, user.id);
    });
    /*
        deserializeUser는 모든 요청에 실행되기 때문에 DB 조회를 캐싱해서 효율적이게 만들어야 한다.
        메모리에 12345만번만 저장
        매 요청 시마다 app.js의 passport.session()에서 index.js의 `passport.deserializeUser()`가 실행.
        user.id를 DB조회 후 req.user로 저장
    */
    passport.deserializeUser((id, done) => {
        // 12345 -> {id: 1, name: yjkwon, age: 26 }생성 -> req.user [input]
        // 캐싱하는게 좋다.
        // if(user[id]){
        //     done(user[id]);
        // }else {
        //     User.findOne({ where: { id } })
        //         .then(user => user[id] = user, done(null, user))
        //         .catch(err => done(err));
        // }
        User.findOne({ where: { id } })
            .then(user => done(null, user))
            .catch(err => done(err));
    });
    local(passport);
    kakao(passport);
};
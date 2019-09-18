# passport 

## serializeUser
__`req.login()`시에 serializeUser호출__

serializeUser은 방금 전에 로그인 성공 시 실행되는 __`done(null, user);`__ 에서 __`user 객체를`__ 전달받아 __`세션(정확히는 req.session.passport.user)`__ 에 저장합니다. 

### 🤔 why Session?
세션이 있어야 페이지 이동 시에도 __`로그인 정보가 유지될 수`__ 있습니다.

```javascript 
passport.serializeUser((user, done) => {
    /*
        {id: 12345, name: yjkwon, age: 26 } -> 12345만 저장
        세션에 모두 저장하기는 너무 무겁다.. -> 많은 사용자의 세션값을 담아야 하기 때문에
        그럼 고유값 id만 저장하자 !
    */
    done(null, user.id);
});
```

### res.isAuthenticated 세션 로그인 여부 
__middlewares.js__

```javascript
exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) { // 로그인 여부 (req.session.passport.user)이 있는지 
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
};
```

## deserializeUser
__`serializeUser에서 `__ done으로 넘겨주는 user가 __`deserializeUser의`__ 첫 번째 매개변수로 전달되기 때문에 __`둘의 타입이 항상 일치해야 합니다.`__
    
__만약 serializeUser에서 user.id만 넘겨줬다면 deserializeUser의 첫 번째 매개변수도 id를 받아야 한다.__

id만 있으면 그 자체로는 req.user을 만들 수 없기 때문에 __`User.findOne(id) 메소드로 완전한 user 객체를 만들어서 done을 해주면 됩니다.`__ 

해당하는 유저 정보가 있으면 __`done의 두 번째 인자를 req.user에`__ 저장하고, 요청을 처리할 때 __`유저의 정보를 req.user를 통해서 `넘겨줍니다.__
    
```javascript
passport.deserializeUser((id, done) => {
    User.findOne({
        where: { id },
        include: [{
            model: User,
            attributes: ['id', 'nick'],
            as: "Followers",
        }, {
            model: User,
            attributes: ['id', 'nick'],
            as: 'Followings',
        }],
    })
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            console.error("passport index user error",err);
            done(err)
        });
});
``` 
### 🤔 리팩토링

deserializeUser는 모든 요청에 실행되기 때문에 DB 조회를 캐싱해서 효율적이게 만들어야 한다.

__if: 메모리(session)에 user.id 저장 시__

1. 매 요청 시마다 app.js의 passport.session()에서 index.js의 **`passport.deserializeUser()`** 가 실행. 

2. user.id를 DB조회 후 req.user로 저장
so. 캐싱 

```javascript
const user={};

// 12345 -> {id: 1, name: yjkwon, age: 26 }생성 -> req.user [input]
    
if(user[id]){
    done(user[id]);
}else {
    User.findOne({ where: { id } })
        .then(user => user[id] = user, done(null, user))
        .catch(err => done(err));
}
```


## local
[참고](https://www.zerocho.com/category/NodeJS/post/57b7101ecfbef617003bf457)

**`urlencoded`** 미들웨어가 해석한 **`req.body의 값들을`** usernameField, passwordField에 연결한다.

**`usernameField와`** **`passwordField는`** 어떤 폼(form) 필드로부터 아이디와 비밀번호를 전달받을 지 설정하는 옵션입니다.

```javascript
function localStrategy(passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email', // req.body.email
        passwordField: 'password', // req.body.password
        // { email: 'yjkwon', password: '1234' } 
        // 이렇게 오면 뒤의 콜백 함수의 email 값이 yjkwon, password 값이 1234 됩니다.
    }, async (usernameField, passwordField, done) => {
        // done(에러 , 성공, 실패)
        // done(null, 사용자정보)
        // done(null, false, 실패정보)
        try {
            const checkUser = await User.findOne({ where: { email } });
            if (checkUser) {
                // 비밀번호 검사
                const resultcompare = await bcrypt.compare(password, checkUser.password);
                if (resultcompare) {
                    done(null, checkUser);
                } else {
                    done(null, false, { message: '이메일-비밀번호가 일치하지 않습니다.' });
                }
            }
            else {
                done(null, false, { message: '이메일-비밀번호가 일치하지 않습니다.' });
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
}
```

### 전략
__auth.js__
```javascript
router.post('/login', isNotLoggedIn, (req, res, next) => { // req.body.email, req.body.password
    // done(에러 ,성공,실패)가 아래로 전달된다. (authErr, user, info)
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            req.flash('loginError', info.message);
            return res.redirect('/');
        }
        return req.login(user, (loginError) => { // req.user // 세션에 저장
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙인다.
});
```

## kakao

`clientID`: 카카오 앱 아이디

`callbackURL`: 카카오 리다이렉트 주소

### 전략
    
1. /auth/kakao 호출
2. 카카오 로그인
3. /auth/kakao/callback으로 profile 반환

### 언제 req.login?? 🤔🤔🤔
serializeUser는 req.login 시에 호출 된다.

카카오 전략에서는 req.login을 찾을 수 없는데 strategy에서 done을 하면 내부적으로 req.login이 된다.

__auth.js__
```javascript
// (1)
router.get('/kakao', passport.authenticate('kakao'));
```

```javascript
// (3)
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (_req, res) => {
    res.redirect('/');
});
```

__kakaostrategy.js__

__로그인은 카카오가 대신 처리해주지만 디비에 사용자를 저장해주기로 한다. (snsId, provider 사용)__
```javascript
function kakaoStrategy(passport) {
    // (2) (4)
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
```

## logout
```javascript
router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    // req.sessiopn.destroy()는 세션을 지운다. (사실 logout시에는 안 해도 된다. 다른 세션도 같이 지워진다.)
    // req.session.destroy(); // req.user
    res.redirect('/');
});
```
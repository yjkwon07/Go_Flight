const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('dotenv').config(); // process.env에 설정

const indexRouter = require('./routes');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express(); // get express
sequelize.sync(); // config start
passportConfig(passport); // config start 

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT || 8001);

app.use(morgan('dev'));
app.use('/static',express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname, '/public/js')));
app.use('/img', express.static(path.join(__dirname, '/public/upload')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));
// connect-flash 미들웨어는 cookie-parser와 express-session을 사용하므로 이들보다는 뒤에 위치해야 합니다.
app.use(flash());
// passport 설정 초기화
app.use(passport.initialize());
// express session이 session을 만들고 난 후 passport가 session을 사용하여 사용자 정보를 저장한다.
app.use(passport.session());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

app.use((_req, _res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, _req, res, _next) =>{
    res.locals.message = err.message;
    res.locals.error = app.get('env') === 'development' ? err : {};
    res.status(err.status || 505);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(`${app.get('port')}번 포트에서 서버 실행중입니다.`);
});
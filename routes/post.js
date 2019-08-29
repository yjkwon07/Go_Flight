const express = require('express');
const multer = require('multer');
const mkdir = require('../public/js/publicDir');
const path = require('path');

const router = express.Router();
const { Post, Hashtag, User } = require('../models');
const { isLoggedIn } =require('./middlewares');

// Create folder path
mkdir.mkdirp('./public/upload');

// multipart/from-data는 express.json과 express.urlencoded가 해석을 못 한다.
// 이미지를 업로드하려면 폼을 multipart/form-data로,
// 그리고 이 것을 해석하려면 `multer`가 필요하다.

// storage: 어디에 저장할지
// limit: 파일 사이즈(바이트 단위)
const upload = multer({
    storage: multer.diskStorage({
        // destination: 파일 경로
        // filename: 파일명
        // cb(에러, 결괏값) -> callback
        destination(_req, _file, cb) {
            cb(null, 'public/upload/');
        },
        filename(_req, file, cb) {
            const ext = path.extname(file.originalname);
            // (에러 , 설정 )
            // 파일명 중복 막기
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limit: { fileSize: 5 * 1024 * 1024 },
});
/*
    single: 이미지 하나(필드명-> id 혹은 name)
    array: 이미지 여러 개(단일 필드)
    fields: 이미지 여러 개( 여러 필드)
    none: 이미지가 아니다.
*/
router.post('/img', isLoggedIn , upload.single('img'), (req, res) => {
    // console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` });
});

/*
    사진 업로드 후 게시글 업로드 시에는 사진 대신
    사진 주소를 올리므로 none을 쓴다.
*/
const upload2 = multer();
router.post('/', isLoggedIn ,upload2.none(), async (req, res, next) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            userId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        if (hashtags) {
            // 안녕하세요 #노드 #익스프레스
            // hashtags = ['#노드', '#익스프레스'], ['#노드', '#atom']
            // #노드가 중복
            // findOrCreate: DB에 있으면 찾고 없으면 새로 생성
            // 저장결과가 result에 담는다.
           const result =  await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
                where: { title: tag.slice(1).toLowerCase() },
            })));
            await post.addHashtags(result.map(r => r[0])); // map으로 이차원 배열을 1차원으로 만들어주어 리턴한다.
            res.redirect('/');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/*
    A.getB: 관계있는 로우 조회
    A.addB: 관계 생성
    A.setB: 관계 수정
    A.removeB: 관계 제거
*/
router.get('/hashtag', async (req, res, next) => {
    const query = req.query.hashtag;
    if(!query) {
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.findOne({ where : { title : query } });
        let posts = [];
        if(hashtag) {
            posts = await hashtag.getPosts({ include: [{ model: User}] });
        }
        return res.render('main', {
            title : `${query} | GoFlight`,
            user: req.user,
            twits: posts,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
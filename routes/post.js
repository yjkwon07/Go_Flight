const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { Post, Hashtag } = require('../models');

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
            cb(null, 'upload/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            // (에러 , 설정 )
            // 파일명 중복 막기
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf + ext);
        },
    }),
    limit: { fileSize: 5 * 1024 * 1024 },
});
/*
    single: 이미지 하나(필드명)
    array: 이미지 여러 개(단일 필드)
    fields: 이미지 여러 개( 여러 필드)
    none: 이미지가 아니다.
*/
router.post('/img', upload.single('img'), (req, res) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.fieldname}` });
});

/*
    사진 업로드 후 게시글 업로드 시에는 사진 대신
    사진 주소를 올리므로 none을 쓴다.
*/
const upload2 = multer();
router.post('/', upload2.none(), async (req, res ,next) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            userId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s]*/g);
        if(hashtags){
            // 안녕하세요 #노드 #익스프레스
            // hashtags = ['#노드' , '#익스프레스'] ['#노드', '#atom']
            // #노드가 중복
            // findOrCreate: DB에 있으면 찾고 없으면 새로 생성
            await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
                where: {title: tag.slice(1).toLowerCase() },
            })));
            // 저장결과가 result에 담는다.
            await post.addHashtags(result.map(r=>r[0]));
            /*
                A.getB: 관계있는 로우 조회
                A.addB: 관계 생성
                A.setB: 관계 수정
                A.removeB: 관계 제거
            */
           res.redirect('/');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
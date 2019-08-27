const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

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

router.post('/');



module.exports = router;
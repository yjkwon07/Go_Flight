# multer

multipart/from-data는 app.js에서 express.json과 express.urlencoded가 해석을 못 한다.

이미지를 업로드하려면 폼을 multipart/form-data로,
그리고 이 것을 해석하려면 **`multer`** 가 필요하다.

**`storage`** : 어디에 저장할지

**`limit`** : 파일 사이즈(바이트 단위)

**`destination`** : 파일 경로

**`filename`** : 파일명

**`callback(에러, 결괏값)`** : callback

```javascript
    const upload = multer({
        storage: multer.diskStorage({
            destination(_req, _file, callback) {
                callback(null, 'public/img');
            },
            filename(_req, file, callback) {
                const ext = path.extname(file.originalname);
                // (에러 , 설정 )
                // 파일명 중복 막기
                callback(null, path.basename(file.originalname, ext) + Date.now() + ext);
            },
        }),
        limit: { fileSize: 5 * 1024 * 1024 },
    });
```

## multer method

**`single`** : 이미지 하나(필드명 -> (HTML)id 혹은 name)

**`array`** : 이미지 여러 개(단일 필드)

**`fields`** : 이미지 여러 개(여러 필드)

**`none`** : 이미지가 아니다.

```javascript
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    // 썸네일 ajax 통신 result
    res.json({ url: `/img/${req.file.filename}` });
});
```

**사진 업로드 후 게시글 업로드 시에는 사진 대신 사진 주소를 올리므로 none을 쓴다.**

    게시글: 안녕하세요 #노드 #익스프레스
    hashtags = ['#노드', '#익스프레스'], ['#노드', '#atom']
    -> #노드가 중복
    findOrCreate: DB에 있으면 찾고 없으면 새로 생성
    저장결과가 new_Create_Hashtags_Arr에 담는다.

```javascript
    router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
        try {
            const post = await Post.create({
                content: req.body.content,
                img: req.body.url,
                userId: req.user.id,
            });
            const hashtags = req.body.content.match(/#[^\s#]*/g);
            if (hashtags) {
                const new_Create_Hashtags_Arr = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
                    where: { title: tag.slice(1).toLowerCase() },
                })));
                // map으로 이차원 배열을 1차원으로 만들어주어 리턴한다.
                await post.addHashtag(new_Create_Hashtags_Arr.map(find_HashtagId => find_HashtagId[0]));  
            }
            res.redirect('/');
        } catch (error) {
            console.error(error);
            next(error);
        }
    });
```
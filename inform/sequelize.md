# sequelize 

## 1 대 1 관계
__주가 되는 1이 먼저 나와야 한다.__
```javascript
db.User.hasOne(db.Post);
db.Post.belongsTo(db.User);
```

## 1 대 다 관계
__1: (사용자 한명이 게시글을 많이 가지고 있다)__

__다: (게시글은 사용자에 속해 있다)__

__`foreignKey는 자동으로 생성 된다.`__

Post테이블에 userId 자동 생성 (foreignKey)

하지만 사용자가 명시해주는것이 좋은 방법이라고 생각한다.🙈🙈

```javascript
db.User.hasMany(db.Post);
db.Post.belongsTo(db.User, {as: "User", foreignKey: "userId"});
```

### foreignKey 🤔🤔🤔
belongsTo냐 belongsToMany냐에 따라 foreignKey 방법이 달라 진다.

belongsTo인 경우에는 `as랑 foreignKey모두 상대 테이블을` 가리키면 된다.

belongstoMany의 경우에는 `as와 foreignKey를 반대되게` 설정하면 된다.

## 다 대 다 관계
__다대다 관계는 belongsToMany!!(belongsTo가 아니다.)__

__through에는 새로 생기는 모델 이름을 넣어준다.(매칭 테이블 생성)__

__as: 매칭 모델 이름__

__foreignKey: 상대 테이블 아이디__

__A.belongsToMany(B, {as: 'Bname', foreignKey:'A_id'})__
```javascript
// PostHashtag테이블 생성
db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag', as: "Hashtag", foreignKey: 'postId'});
db.Hashtag.belongsToMany(db.Post, {through: 'PostHashtag' , as : "Post", foreignKey: 'hashtagId'});
```

```javascript
db.User.belongsToMany(db.User, {through: 'Follow', as: 'Followers', foreignKey: 'followingId'});
db.User.belongsToMany(db.User, {through: 'Follow', as: 'Followings', foreignKey: 'followerId'});
```

```javascript
db.User.belongsToMany(db.Post, {through: 'Like', as: "Post", foreignKey: 'userId'});
db.Post.belongsToMany(db.User, {through: 'Like', as: "Liker", foreignKey: 'postId'});
```

## Sequelize Query

### findOne (select)
```javascript
await User.findOne({ where: { id: req.user.id } });
```

### findAll & include (select)
__includes에서 같은 모델이 여러 개면 as로 구분한다.__

```javascript
router.get('/', (req, res, next) => {
    Post.findAll({
        include: [{
            model: User,
            attributes: ['id', 'nick'],
            as: "User"
        },{
            model: User,
            attributes: ['id', 'nick'],
            as: 'Liker'
        }],
        order: [['createdAt', 'DESC']],
    })
        .then((posts) => {
            res.render('main', {
                title: 'GoFlight',
                twits: posts,
                user: req.user,
                loginError: req.flash('loginError'),
            });
        })
        .catch((error) => {
            console.error(error);
            next(error);
        });
});
```

### update (update)
```javascript
await User.update({ nick: req.body.nick }, {
            where: { id: req.user.id },
    });
```

### create (insert)
```javascript
await Post.create({
            content: req.body.content,
            img: req.body.url,
            userId: req.user.id,
    });
```

### destroy (delete)
```javascript
await Post.destroy({
        where: {
            id: req.params.id,
            userId: req.user.id,
        },
    });
```
## foreignKey

    A.getB: 관계있는 로우 조회
    A.addB: 관계 생성
    A.setB: 관계 수정
    A.removeB: 관계 제거

### get
```javascript
if (hashtag) {
    posts = await hashtag.getPost({ include: [{ model: User }] });
}
```

### add
`followingId`: _req.params.id

`followerId`: _req.user.id
```javascript
db.User.belongsToMany(db.User, {through: 'Follow', as: 'Followers', foreignKey: 'followingId'});
db.User.belongsToMany(db.User, {through: 'Follow', as: 'Followings', foreignKey: 'followerId'});
```
```javascript
router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        await user.addFollowings(parseInt(req.params.id, 10));
        res.send('success');
    } catch (error) {
        console.error(error);
        next(error);
    }
});
```

### remove 

```javascript
router.post('/:id/unfollow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        await user.removeFollowings(parseInt(req.params.id, 10));
        res.send('success');
    } catch (error) {
        console.error(error);
        next(error);
    }
});
```


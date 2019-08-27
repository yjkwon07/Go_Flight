const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);

// 1대1 관계 
// 주가 되는 1이 먼저 나와야 한다.
// db.User.hasOne(db.Post);
// db.Post.belongsTo(db.User);

// 1대다 관계
// 1 (사용자 한명이 게시글을 많이 가지고 있다)
db.User.hasMany(db.Post);
// 다 (게시글은 사용자에 속해 있다)
db.Post.belongsTo(db.User);

// 다대다 관계는 belongsToMany(belongsTo가 아니다.)
// through에는 새로 생기는 모델 이름을 넣어준다.(매칭 테이블)
db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag'});
db.Hashtag.belongsToMany(db.Post, {through: 'PostHashtag'});
// 1. 안녕하세요. #노드 #익스프레스
// 2. 안녕하세요. #노드 #제이드
// 3. 안녕하세요 # 제이드 #퍼그

// as: 매칭 모델 이름
// foreignKey: 상대 테이블 아이디
// A.belongsToMany(B, {as: 'Bname', foreignKey:'A_id'})
db.User.belongsToMany(db.User, {through: 'Follow', as : 'Followers', foreignKey: 'followongId'});
db.User.belongsToMany(db.User, {through: 'Follow', as : 'Following', foreignKey: 'followerId'});

// 1. 제로
// 2. 네로
// 3. 히어로

// 1-2
// 1-3
// 2-3
// 3-1
// 1-4

// 1. 제로
// 2. 네로
// 3. 히어로
// 4. 바보
db.User.belongsToMany(db.Post, {through: 'Like'});
db.Post.belongsToMany(db.User, {through: 'Like'});

module.exports = db;

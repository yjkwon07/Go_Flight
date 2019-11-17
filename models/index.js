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

db.User.hasMany(db.Post, { foreignKey: 'userId', sourceKey: 'id' });
db.Post.belongsTo(db.User, { through: 'Post', as: 'User', foreignKey: 'userId', targetKey: 'id' });

db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag', as: 'PostHashtag_Hashtag', foreignKey: 'postId' });
db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag', as: 'PostHashtag_Post', foreignKey: 'hashtagId' });

db.User.belongsToMany(db.User, { through: 'Follow', as: 'Follow_Followers', foreignKey: 'followingId' });
db.User.belongsToMany(db.User, { through: 'Follow', as: 'Follow_Followings', foreignKey: 'followerId' });

db.User.belongsToMany(db.Post, { through: 'Like', as: "Like_Post", foreignKey: 'userId' });
db.Post.belongsToMany(db.User, { through: 'Like', as: "Like_Liker", foreignKey: 'postId' });

module.exports = db;
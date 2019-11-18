module.exports = (sequelize, DataTypes) => {
  return sequelize.define('hashtag', {
      title: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
      },
    }, {
      timestamps: true,
      paranoid: true,
      charset: 'utf8',
      collage:'utf8_genral_ci',
    })
};
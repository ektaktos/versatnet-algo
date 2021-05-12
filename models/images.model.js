module.exports = (sequelize, DataTypes) => {
  const Images = sequelize.define('images', {
    image_url: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },{
    paranoid: true,
    underscored: true,
  });
  return Images;
}
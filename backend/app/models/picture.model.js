module.exports = (sequelize, Sequelize) => {
  const Picture = sequelize.define("Picture", {
    PictureID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    PicturePath: {
      type: Sequelize.STRING,
    },
    CategoryID: {
      type: Sequelize.INTEGER,
      references: {
        model: "Category",
        key: "CategoryID",
      },
    },
  });

  const Category = require("./category.model");

  Picture.belongsTo(Category, {
    foreignKey: "CategoryID",
  });

  return Pictures;
};

module.exports = {
  Picture,
};

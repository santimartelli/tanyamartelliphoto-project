module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define("Category", {
    CategoryID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    CategoryName: {
      type: Sequelize.STRING,
    },
  });

  const Picture = require("./picture.model");

  Category.hasMany(Picture, {
    foreignKey: "CategoryID",
  });

  return Category;
};

module.exports = {
  Category,
};


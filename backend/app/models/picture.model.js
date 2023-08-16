const sql = require("./db.js");

const Picture = function (picture) {
  this.picturePath = picture.picturePath;
  this.categoryID = picture.categoryID;
};

Picture.create = (newPicture, result) => {
  sql.query("INSERT INTO pictures SET ?", newPicture, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created picture: ", { id: res.insertId, ...newPicture });
    result(null, { id: res.insertId, ...newPicture });
  });
};

Picture.getAll = (result) => {
  sql.query("SELECT * FROM pictures", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("pictures: ", res);
    result(null, res);
  });
};

Picture.getByCategory = (categoryID, result) => {
  sql.query(
    "SELECT * FROM pictures WHERE categoryID = ?",
    categoryID,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log(`pictures in category ${categoryID}: `, res);
      result(null, res);
    }
  );
};

Picture.updateCategory = (pictureID, newCategoryID, result) => {
  sql.query(
    "UPDATE pictures SET categoryID = ? WHERE pictureID = ?",
    [newCategoryID, pictureID],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Picture with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated picture category: ", {
        pictureID: pictureID,
        newCategoryID: newCategoryID,
      });
      result(null, { pictureID: pictureID, newCategoryID: newCategoryID });
    }
  );
};

Picture.remove = (pictureID, result) => {
  sql.query(
    "DELETE FROM pictures WHERE pictureID = ?",
    pictureID,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Picture with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("deleted picture with pictureID: ", pictureID);
      result(null, res);
    }
  );
};

module.exports = Picture;

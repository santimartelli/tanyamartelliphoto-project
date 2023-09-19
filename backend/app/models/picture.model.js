const sql = require("./db.js");
const connection = require("./db.js");

const Picture = function (picture) {
  this.picturePath = picture.picturePath;
  this.categoryID = picture.categoryID;
};

Picture.create = (pictureData, callback) => {
  const sql = 'INSERT INTO Pictures (picturePath, categoryID) VALUES ?';
  connection.query(sql, [pictureData], callback)
};

// I would like to get all the pictures and also CategoryName for each picture

Picture.getAll = (result) => {
  sql.query(
    `
  SELECT
    p.pictureID, p.picturePath, p.categoryID, c.categoryName
  FROM Pictures p
  INNER JOIN Categories c
    ON p.categoryID = c.categoryID
`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      } else if (res.length == 0) {
        result(null, { message: "No pictures found!" });
        return;
      }
      //console.log("pictures: ", res);
      result(null, res);
    }
  );

  Picture.getByCategory = (categoryID, result) => {
    sql.query(
      "SELECT * FROM Pictures WHERE categoryID = ?",
      categoryID,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        if (res.length) {
          const picturesFound = [];
          res.forEach((picture) => {
            picturesFound.push(picture);
          });
          console.log("found pictures: ", picturesFound);
          result(null, picturesFound);
          return;
        }

        // not found Category with the id
        result({ kind: "not_found" }, null);
      }
    );
  };

  Picture.updateById = (pictureID, updatedPicture, result) => {
    sql.query(
      "UPDATE Pictures SET picturePath = ?, categoryID = ? WHERE pictureID = ?",
      [updatedPicture.picturePath, updatedPicture.categoryID, pictureID],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        if (res.affectedRows == 0) {
          // Picture with the ID not found
          result({ kind: "not_found" }, null);
          return;
        }

        console.log("updated picture: ", { id: pictureID, ...updatedPicture });
        result(null, { id: pictureID, ...updatedPicture });
      }
    );
  };

  Picture.deleteById = (pictureID, result) => {
    sql.query(
      "DELETE FROM Pictures WHERE pictureID = ?",
      pictureID,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        if (res.affectedRows == 0) {
          // Picture with the ID not found
          result({ kind: "not_found" }, null);
          return;
        }

        console.log("Deleted picture with id:", pictureID);
        result(null, res);
      }
    );
  };

  Picture.deleteAllByCategory = (categoryID, result) => {
    sql.query(
      "DELETE FROM Pictures WHERE categoryID = ?",
      categoryID,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        console.log(
          `deleted ${res.affectedRows} pictures for category ${categoryID}`
        );
        result(null, res);
      }
    );
  };

  Picture.deleteAll = (result) => {
    sql.query("DELETE FROM Pictures", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log(`deleted ${res.affectedRows} pictures`);
      result(null, res);
    });
  };
};

module.exports = Picture;

// const sql = require("./db.js");
// const connection = require("./db.js");

// const Picture = function (picture) {
//   this.picturePath = picture.picturePath;
//   this.categoryId = picture.categoryId;
// };

// Picture.create = (pictureData, callback) => {
//   const sql = 'INSERT INTO Pictures (picturePath, categoryId) VALUES ?';
//   connection.query(sql, [pictureData], callback)
// };

// // I would like to get all the pictures and also CategoryName for each picture

// Picture.getAll = (result) => {
//   sql.query(
//     `
//   SELECT
//     p.pictureId, p.picturePath, p.categoryId, c.categoryName
//   FROM Pictures p
//   INNER JOIN Categories c
//     ON p.categoryId = c.categoryId
// `,
//     (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(null, err);
//         return;
//       } else if (res.length == 0) {
//         result(null, { message: "No pictures found!" });
//         return;
//       }
//       //console.log("pictures: ", res);
//       result(null, res);
//     }
//   );

//   Picture.getByCategory = (categoryId, result) => {
//     sql.query(
//       "SELECT * FROM Pictures WHERE categoryId = ?",
//       categoryId,
//       (err, res) => {
//         if (err) {
//           console.log("error: ", err);
//           result(null, err);
//           return;
//         }

//         if (res.length) {
//           const picturesFound = [];
//           res.forEach((picture) => {
//             picturesFound.push(picture);
//           });
//           console.log("found pictures: ", picturesFound);
//           result(null, picturesFound);
//           return;
//         }

//         // not found Category with the id
//         result({ kind: "not_found" }, null);
//       }
//     );
//   };

//   Picture.updateById = (pictureId, updatedPicture, result) => {
//     sql.query(
//       "UPDATE Pictures SET picturePath = ?, categoryId = ? WHERE pictureId = ?",
//       [updatedPicture.picturePath, updatedPicture.categoryId, pictureId],
//       (err, res) => {
//         if (err) {
//           console.log("error: ", err);
//           result(err, null);
//           return;
//         }

//         if (res.affectedRows == 0) {
//           // Picture with the ID not found
//           result({ kind: "not_found" }, null);
//           return;
//         }

//         console.log("updated picture: ", { id: pictureId, ...updatedPicture });
//         result(null, { id: pictureId, ...updatedPicture });
//       }
//     );
//   };

//   Picture.deleteById = (pictureId, result) => {
//     sql.query(
//       "DELETE FROM Pictures WHERE pictureId = ?",
//       pictureId,
//       (err, res) => {
//         if (err) {
//           console.log("error: ", err);
//           result(err, null);
//           return;
//         }

//         if (res.affectedRows == 0) {
//           // Picture with the ID not found
//           result({ kind: "not_found" }, null);
//           return;
//         }

//         console.log("Deleted picture with id:", pictureId);
//         result(null, res);
//       }
//     );
//   };

//   Picture.deleteAllByCategory = (categoryId, result) => {
//     sql.query(
//       "DELETE FROM Pictures WHERE categoryId = ?",
//       categoryId,
//       (err, res) => {
//         if (err) {
//           console.log("error: ", err);
//           result(err, null);
//           return;
//         }

//         console.log(
//           `deleted ${res.affectedRows} pictures for category ${categoryId}`
//         );
//         result(null, res);
//       }
//     );
//   };

//   Picture.deleteAll = (result) => {
//     sql.query("DELETE FROM Pictures", (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(err, null);
//         return;
//       }

//       console.log(`deleted ${res.affectedRows} pictures`);
//       result(null, res);
//     });
//   };
// };

// module.exports = Picture;

const sql = require("./db.js");

const Picture = function (picture) {
  this.picturePath = picture.picturePath;
  this.categoryId = picture.categoryId;
};

Picture.create = (pictureData, callback) => {
  const query = 'INSERT INTO Pictures (picturePath, categoryId) VALUES ?';
  sql.query(query, [pictureData], callback);
};

Picture.getAll = (result) => {
  sql.query(
    `SELECT p.pictureId, p.picturePath, p.categoryId, c.categoryName
     FROM Pictures p
     INNER JOIN Categories c ON p.categoryId = c.categoryId`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      } else if (res.length === 0) {
        result(null, { message: "No pictures found!" });
        return;
      }
      result(null, res);
    }
  );
};

Picture.getByCategory = (categoryId, result) => {
  sql.query(
    "SELECT * FROM Pictures WHERE categoryId = ?",
    categoryId,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.length) {
        result(null, res);
        return;
      }

      result({ kind: "not_found" }, null);
    }
  );
};

Picture.updateById = (pictureId, updatedPicture, result) => {
  sql.query(
    "UPDATE Pictures SET picturePath = ?, categoryId = ? WHERE pictureId = ?",
    [updatedPicture.picturePath, updatedPicture.categoryId, pictureId],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows === 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: pictureId, ...updatedPicture });
    }
  );
};

Picture.deleteById = (pictureId, result) => {
  sql.query(
    "DELETE FROM Pictures WHERE pictureId = ?",
    pictureId,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows === 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, res);
    }
  );
};

Picture.deleteAllByCategory = (categoryId, result) => {
  sql.query(
    "DELETE FROM Pictures WHERE categoryId = ?",
    categoryId,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

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

    result(null, res);
  });
};

module.exports = Picture;

const sql = require("./db.js");

const Category = function (category) {
  this.categoryName = category.categoryName;
};

Category.create = (newCategory, result) => {
  sql.query("INSERT INTO Categories SET ?", newCategory, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created category: ", { id: res.insertId, ...newCategory });
    result(null, { id: res.insertId, ...newCategory });
  });
};

Category.getAll = (result) => {
  sql.query("SELECT * FROM Categories", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Category.findById = (categoryId, result) => {
  sql.query(
    "SELECT * FROM Categories WHERE CategoryID = ?",
    categoryId,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found category: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found Category with the id
      result({ kind: "not_found" }, null);
    }
  );
};

Category.updateById = (categoryId, category, result) => {
  sql.query(
    "UPDATE Categories SET CategoryName = ? WHERE CategoryID = ?",
    [category.categoryName, categoryId],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Category with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated category: ", { id: categoryId, ...category });
      result(null, { id: categoryId, ...category });
    }
  );
};

Category.removeOne = (categoryId, result) => {
  sql.query("DELETE FROM Categories WHERE CategoryID = ?", categoryId, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      // not found Category with the id
      result({ kind: "not_found" }, null);
      return;
    } else {
      console.log("deleted category with id: ", categoryId);
      result(null, res);
    }
  });
};

Category.removeAll = (result) => {
  sql.query("DELETE FROM Categories", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    } else {
      console.log(`deleted ${res.affectedRows} categories`);
      result(null, res);
    }
  });
};

module.exports = Category;

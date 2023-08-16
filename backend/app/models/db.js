const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config.js");

async function createDatabase() {

  const db = await mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
  });

  await db.query(`CREATE DATABASE IF NOT EXISTS TanyaMartelliPhotography`);

  await db.query(`USE TanyaMartelliPhotography`);

  await db.query(`
    CREATE TABLE IF NOT EXISTS Categories (
      CategoryID INT AUTO_INCREMENT,
      CategoryName VARCHAR(100),
      PRIMARY KEY (CategoryID)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS Pictures (
      PictureID INT AUTO_INCREMENT,
      PicturePath VARCHAR(255),
      CategoryID INT,
      PRIMARY KEY (PictureID),
      FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
    )
  `);

  await db.end();

}

createDatabase();
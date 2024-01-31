/**
 * @fileoverview Este archivo contiene la conexión a la base de datos.
 */

require("dotenv").config();
const mysql = require("mysql2");

/**
 * Crea la conexión a la base de datos.
 * @constant
 * @type {Object}
 * @property {string} host - El servidor de la base de datos.
 * @property {string} user - El usuario de la base de datos.
 * @property {string} password - La contraseña del usuario de la base de datos.
 * @property {string} database - El nombre de la base de datos.
 */
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/**
 * Establece la conexión a la base de datos.
 * @param {function} error - El callback que maneja el error.
 */
connection.connect((error) => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

module.exports = connection;

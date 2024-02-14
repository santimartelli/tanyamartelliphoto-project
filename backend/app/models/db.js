/**
 * Contiene la conexión a la base de datos con MySQL.
 * @module db
 * @requires dotenv
 * @requires mysql2
 */

require("dotenv").config();
const mysql = require("mysql2");

/**
 * Crea la conexión a la base de datos con MySQL.
 * @constant
 * @type {Object}
 * @property {string} host - El servidor de la base de datos.
 * @property {string} user - El usuario de la base de datos.
 * @property {string} password - La contraseña del usuario de la base de datos.
 * @property {string} database - El nombre de la base de datos.
 */
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

connection.getConnection((err, conn) => {
  if (err) throw err;
  console.log("Conexión con la base de datos correcta. Id: " + conn.threadId);
  conn.release(); // Release the connection back to the pool
});

module.exports = connection;




/**
 * Establece la conexión a la base de datos.
 * @param {function} error - El callback que maneja el error.
 * @memberof db
 */
// connection.connect((error) => {
//   if (error) throw error;
//   console.log("Successfully connected to the database.");
// });

// module.exports = connection;

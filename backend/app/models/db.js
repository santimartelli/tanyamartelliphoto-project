/**
 * Contiene la conexión a la base de datos con MySQL.
 * @module db
 * @requires dotenv
 * @requires mysql2
 */

require("dotenv").config();
const mysql = require("mysql2");
const dbConfig = require("../config/db.config.js");

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
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

connection.getConnection((err, conn) => {
  if (err) throw err;
  console.log("Conexión con la base de datos correcta. Id: " + conn.threadId);
  conn.release(); // Release the connection back to the pool
});

// Handle connection pool errors
connection.on('error', (err) => {
  console.error('Database pool error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Database connection was closed.');
  }
  if (err.code === 'ER_CON_COUNT_ERROR') {
    console.error('Database has too many connections.');
  }
  if (err.code === 'ECONNREFUSED') {
    console.error('Database connection was refused.');
  }
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

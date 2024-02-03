/**
 * En archivo de configuración se encuetra la configuración de la base de datos.
 * @module DB_Config
 */

/**
 * Contiene la configuración de la base de datos.
 * @constant
 * @module DB_Config
 * @type {object}
 * @property {string} HOST - El servidor de la base de datos.
 * @property {string} USER - El usuario de la base de datos.
 * @property {string} PASSWORD - La contraseña del usuario de la base de datos.
 * @property {string} DB - El nombre de la base de datos.
 */

require('dotenv').config();
module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
};




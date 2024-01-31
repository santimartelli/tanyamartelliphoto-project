/**
 * @fileoverview Este archivo contiene la configuración de la base de datos.
 */

require('dotenv').config();
module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
};




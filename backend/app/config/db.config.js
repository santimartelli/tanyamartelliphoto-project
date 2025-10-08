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
const fs = require('fs');

/**
 * Devuelve el valor del secreto ya sea directamente o leyendo desde un archivo.
 * Permite compatibilidad con Docker Secrets que montan el valor como archivo.
 * @param {string} value - Valor recibido desde la variable de entorno.
 * @returns {string|undefined} - Valor final del secreto.
 */
const resolveSecret = (value) => {
  if (!value) {
    return value;
  }

  try {
    if (fs.existsSync(value)) {
      return fs.readFileSync(value, 'utf8').trim();
    }
  } catch (error) {
    console.warn('[DB Config] No se pudo leer el secreto desde archivo:', error.message);
  }

  return value;
};

module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: resolveSecret(process.env.DB_PASSWORD),
  DB: process.env.DB_NAME,
  resolveSecret
};




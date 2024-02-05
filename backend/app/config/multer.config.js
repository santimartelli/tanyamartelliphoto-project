/**
 * En este archivo de configuración se encuentra la configuración de 'multer',
 * que se encarga de almacenar los archivos subidos.
 * @module Multer_Config
 */

/**
 * Importa el módulo 'multer' para gestionar los archivos subidos.
 * @const
 * @module Multer_Config
 */
const multer = require('multer');

/**
 * Importa el módulo 'path' para gestionar las rutas de archivos.
 * @const
 * @module Multer_Config
 */
const path = require('path');

/**
 * Comprueba si el archivo subido es una imagen.
 * @param {Object} req - El objeto request.
 * @param {Object} file - El objeto subido.
 * @param {Function} cb - La función callback.
 * @returns {Function} - Devuelve la función callback.
 * @module Multer_Config
 */
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

/**
 * Configuración de cómo almacenar los archivos subidos.
 * @type {object}
 * @property {function} destination - La función que determina la carpeta donde se almacenan los archivos subidos.
 * @property {function} filename - La función que determina el nombre del archivo subido.
 * @module Multer_Config
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${process.env.BASE_URL}/resources/static/assets/uploads/`)
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-tmphoto-${file.originalname}`)
  }
});

/**
 * Asigna a la variable 'upload' la configuración de multer para almacenar los archivos subidos.
 * @param {Object} storage - La configuración de multer para almacenar los archivos subidos.
 * @param {Function} fileFilter - La función que comprueba si el archivo subido es una imagen.
 * @returns {Function} - Devuelve la función que gestiona los archivos subidos
 * @module Multer_Config
 */
const upload = multer({ storage: storage, fileFilter: imageFilter });

// Exporta la variable upload
module.exports = upload;

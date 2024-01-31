/**
 * @fileoverview Este archivo contiene la configuración de multer para el manejo de archivos subidos.
 */

const multer = require('multer');
const path = require('path');

/**
 * Comprueba si el archivo subido es una imagen.
 * @param {Object} req - El objeto request.
 * @param {Object} file - El objeto subido.
 * @param {Function} cb - La función callback.
 * @returns {Function} - Devuelve la función callback.
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
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../resources/static/assets/uploads/'))
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
 */
const upload = multer({ storage: storage, fileFilter: imageFilter });

// Exporta la variable upload
module.exports = upload;

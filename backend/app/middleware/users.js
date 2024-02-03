/**
 * Intermediario para la autenticación de usuarios.
 * @module middleware/users
 */

const jwt = require("jsonwebtoken");

module.exports = {
  /**
   * Valida los datos del formulario de registro.
   * @param {Object} req - El objeto de solicitud HTTP.
   * @param {Object} res - El objeto de respuesta HTTP.
   * @param {Function} next - La siguiente función middleware.
   */
  validateRegister: (req, res, next) => {
    // username minimo 3 caracteres
    if (!req.body.username || req.body.username.length < 3) {
      return res.status(400).send({
        msg: 'Please enter a username with min. 3 chars'
      });
    }
    // password minimo 6 caracteres
    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).send({
        msg: 'Please enter a password with min. 6 chars'
      });
    }
    // password (repeat) no coincide
    if (
      !req.body.password_repeat ||
      req.body.password != req.body.password_repeat
    ) {
      return res.status(400).send({
        msg: 'Both passwords must match'
      });
    }
    next();
  },

  /**
   * Comprueba si el usuario está logueado verificando el token.
   * @param {Object} req - El objeto de solicitud HTTP.
   * @param {Object} res - El objeto de respuesta HTTP.
   * @param {Function} next - La siguiente función middleware.
   */
  isLoggedIn: (req, res, next) => {
    console.log(req.userData);
    try {
      const token = req.headers.authorization.split(" ")[1];
      console.log('Token: ', token);
      const secretKey = process.env.JWT_SECRET_KEY;
      console.log('Secret key: ', secretKey);
      const decoded = jwt.verify(token, secretKey);
      console.log('Decoded: ', decoded);
      req.userData = decoded;
      next();
    } catch (err) {
      console.error('JWT Verification Error:', err.message);
      return res.status(401).send({
        msg: "Your session is not valid!",
      });
    }
  },
};

/**
 * @fileoverview Este archivo contiene las rutas para la gestión de usuarios.
 */

module.exports = (app) => {
  const express = require("express");
  const router = express.Router();
  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");
  const db = require("../models/db.js");
  const userMiddleware = require("../middleware/users.js");
  require('dotenv').config();
  const secretKey = process.env.JWT_SECRET_KEY;

  /**
   * @description Ruta para registrar un nuevo usuario.
   */
  router.post("/sign-up", userMiddleware.validateRegister, (req, res, next) => {
    db.query(
      `SELECT * FROM users WHERE LOWER(username) = LOWER(${db.escape(
        req.body.username
      )});`,
      (err, result) => {
        // Compueba si el nombre de usuario ya está en uso
        if (result.length) {
          return res.status(409).send({
            msg: "This username is already in use!",
          });
        } else {
          // Se encripta la contraseña
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).send({
                msg: err,
              });
            } else {
              // Cuando la contraseña ha sido encriptada, se almacena en la base de datos
              db.query(
                `INSERT INTO users (username, password, registered) VALUES (${db.escape(
                  req.body.username
                )}, ${db.escape(hash)}, now())`,
                (err, result) => {
                  if (err) {
                    throw err;
                    return res.status(400).send({
                      msg: err,
                    });
                  }
                  return res.status(201).send({
                    msg: "Registered!",
                  });
                }
              );
            }
          });
        }
      }
    );
  });

  /**
   * @description Ruta para iniciar sesión de usuario.
   */
  router.post("/login", (req, res, next) => {
    db.query(
      `SELECT * FROM users WHERE username = ${db.escape(req.body.username)};`,
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(400).send({
            msg: err,
          });
        }
        if (!result.length) {
          console.log(`User not found for username: ${req.body.username}`);
          return res.status(401).send({
            msg: "Username or password is incorrect! 1",
          });
        }

        bcrypt.compare(
          req.body.password,
          result[0]["password"],
          (bErr, bResult) => {
            if (bErr) {
              console.error(bErr); // Log bcrypt error
              return res.status(401).send({
                msg: "Username or password is incorrect!",
              });
            }
            if (bResult) {
              console.log("User logged in successfully");
              const token = jwt.sign(
                {
                  username: result[0].username,
                  userId: result[0].id,
                },
                secretKey,
                {
                  expiresIn: "2h",
                }
              );
              db.query(
                `UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`
              );
              return res.status(200).send({
                msg: "Logged in!",
                token,
                user: result[0],
                expiresIn:  7200,
              });
            }

            console.log("Password comparison failed");
            return res.status(401).send({
              msg: "Username or password is incorrect! 3",
            });
          }
        );
      }
    );
  });

  app.use("/api/users", router);
};

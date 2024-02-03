/**
 * @fileoverview Este es el archivo principal del servidor de la aplicación Tanya Martelli Photography.
 * Define el servidor, requiere las dependencias necesarias, establece las configuraciones necesarias,
 * establece las rutas de la aplicación y también se encarga de escuchar las peticiones entrantes.
 */


const express = require("express");
require('dotenv').config();
const cors = require("cors");
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// archivos estáticos, se usa para servir los archivos estáticos del directorio 'resources/static...'
app.use('/resources/static/assets/uploads', express.static(path.join(__dirname, 'resources/static/assets/uploads')));

// cors, se usa para permitir las peticiones desde el cliente
var corsOptions = {
  origin: true
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json, se usa para parsear el contenido de las peticiones
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded, se usa para parsear el contenido de las peticiones
app.use(express.urlencoded({ extended: true }));

// ruta simple para comprobar que el servidor está funcionando
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Tanya Martelli Photography application." });
});

// requiere las rutas de la aplicación
require("./app/routes/category.routes.js")(app);
require("./app/routes/picture.routes.js")(app);
require("./app/routes/user.routes.js")(app);
require("./app/routes/message.routes.js")(app);
require("./app/routes/booking.routes.js")(app);
require("./app/routes/email.routes.js")(app);

// establece el puerto y escucha las peticiones entrantes
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
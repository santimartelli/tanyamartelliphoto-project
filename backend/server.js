const express = require("express");
require('dotenv').config();
const cors = require("cors");
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use('/resources/static/assets/uploads', express.static(path.join(__dirname, 'resources/static/assets/uploads')));

// cors
var corsOptions = {
  origin: true
};
app.use(cors(corsOptions));

// body parser
app.use(bodyParser.json());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Tanya Martelli Photography application." });
});

require("./app/routes/category.routes.js")(app);
require("./app/routes/picture.routes.js")(app);
require("./app/routes/user.routes.js")(app);
require("./app/routes/message.routes.js")(app);
require("./app/routes/booking.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
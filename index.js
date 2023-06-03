const express = require("express");
const app = express();

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);

const port = process.env.PORT || 2200;
let server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);

module.exports = server;

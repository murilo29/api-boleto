const config = require("config");
const express = require("express");
const consign = require("consign");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

consign().include("src/controller").into(app);

app.listen(config.get("api.porta"), () => {
  console.log(`Servidor Iniciado http://localhost:${config.get("api.porta")}`);
});

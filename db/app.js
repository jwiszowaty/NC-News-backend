const express = require("express");
const app = express();
const { getTopics } = require("../controllers/topics_controller");
const { getEndpoints } = require("../controllers/endpoints_controller");

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.all("/*", (req, res) => {
  res.status(404).send({message: 'No such path...\n...yet'})
})

module.exports = app;

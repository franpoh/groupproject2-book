const { sequelize, testConnection, Users } = require("./connect.js");

const express = require('express');
const app = express();

testConnection();

app.get('/', async (req, res) => {
  const results = await Users.findAll();
  res.send(JSON.stringify(results));
});

app.listen(process.env.PORT);
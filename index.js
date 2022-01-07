const { sequelize, testConnection, Users, Index, Swap, Reviews, Genres } = require("./connect.js");

const express = require('express');
const app = express();

testConnection();

app.get('/', async (req, res) => {
  res.send("Welcome to the bookswap!");
});

// Testing database connections
app.get('/test', async (req, res) => {
  const users = await Users.findAll();
  const index = await Index.findAll();
  const swap = await Swap.findAll();
  const reviews = await Reviews.findAll();
  const genres = await Genres.findAll();

  res.send(JSON.stringify([users, index, swap, reviews, genres]));
});

app.listen(process.env.PORT);
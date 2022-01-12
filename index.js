const { sequelize, testConnection, Users, Index, Swap, Reviews, Genres } = require("./connect.js");

const express = require('express');
const app = express();

const generalRoutes = require("./routes/generalRoutes.js");
const protectedRoutes = require("./routes/protectedRoutes.js");

// Test connections
testConnection();

// Parsing JSON
app.use(express.json());

// Adding middleware to all protected routes
const authenticateJwt = require("./authentication/authJwt");
app.use('/protected', authenticateJwt);

// Main Page
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

  // res.send(JSON.stringify([users, index, swap, reviews, genres]));
  res.json([index, reviews]); //AuntPyone testing
});

// dev: delete reviews
app.delete("/testDel/:reviewId", async (req, res) => {
  const index = Reviews.findByPk(req.params.reviewId);
  await (await index).destroy(); //go to defined index line 67, delete 1 item
  res.status(200);
  return res.send("Delete successful");
}
  //   res.status(404);
  // return res.send("Fruit not found");
)

// Sign in routes (Register, Login) AND public user requests                  
app.use(generalRoutes);
// registered users options - requests
app.use(protectedRoutes);

// Port listening
app.listen(process.env.PORT);
const { sequelize, testConnection, Users, Index, Swap, Reviews, Genres } = require("./connect.js");

const express = require('express');
const app = express();

const cors = require('cors');
const cookieParser = require('cookie-parser');

const generalRoutes = require("./routes/general-routes.js");
const protectedRoutes = require("./routes/protected-routes.js");

const whitelist = ["http://localhost:3000", process.env.ORIGIN];

const corsOptions = {
  // Configures the Access-Control-Allow-Origin CORS header to specific origin
  // origin: process.env.ORIGIN,
  credentials: true, // Configures the Access-Control-Allow-Credentials CORS header. Set to true to pass the header, otherwise it is omitted.
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}

// Test connections 
testConnection();

// Parsing JSON
app.use(express.json());

// enable cors for all routes
app.use(cors(corsOptions));

// Parsing Cookies
app.use(cookieParser());

// Adding middleware to all protected routes
const { verifyJwtAccess } = require("./authentication/auth-access-jwt");
const { verifyJwtRefresh } = require("./authentication/auth-refresh-jwt");
const { protectedPermission, adminPermission } = require("./authentication/user-permissions");

app.use('/protected', verifyJwtAccess, verifyJwtRefresh, protectedPermission);
app.use('/protected/admin', adminPermission);

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
  res.json([index, users, swap, genres, reviews]); //AuntPyone testing
});

// auntpyone dev: delete reviews
app.delete("/testDel/:reviewId", async (req, res) => {
  const index = Reviews.findByPk(req.params.reviewId);
  await (await index).destroy();
  res.status(200);
  return res.send("Delete successful");
})

// Sign in routes (Register, Login) AND public user requests                  
app.use(generalRoutes);
// registered users options - requests
app.use(protectedRoutes);

// Port listening
app.listen(process.env.PORT);
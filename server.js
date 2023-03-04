const express = require('express');
const app = express();
const logger = require('morgan');
const session = require('express-session');
const cron = require('./cron/cacheUsersGames');
const passport = require('passport');
const userRoutes = require('./api/routes/users');
const gameRoutes = require('./api/routes/games');
const groupRoutes = require('./api/routes/groups');
const authRoutes = require('./api/routes/auth');
const cors = require('cors');

// allow dynamic port by host
const port = process.env.PORT || 3030;

// middleware - log out incoming requests
app.use(logger('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECERET,
    resave: true,
    saveUninitialized: false,
    cookie: { secure: !true },
  })
);

app.use(cors());

app.use(passport.initialize());
app.use(passport.authenticate('session'));

const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

// middleware - takes info passed in through the body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// middleware - adds headers to allow CORS.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    // If a request for options, send back 200 with headers, but don't move onto the next middleware.
    res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET');
    res.send(200);
  } else {
    next();
  }
});

// middleware - filter all requests for users to the userRoutes
app.use('/api/v1/users', userRoutes);
// middleware - filter all requests for games to the gameRoutes
app.use('/api/v1/games', gameRoutes);
// middleware - filter all requests for groups to the groupRoutes
app.use('/api/v1/groups', groupRoutes);
// midleware - filter all requests for authentication
app.use('/auth', authRoutes);

// middleware - catch any requests that aren't caught by previous filters
app.use((req, res, next) => {
  const error = new Error('No route found');
  error.status = 404;
  next(error);
});

// middleware - catch any errors that happen other places in the application (DB, etc.)
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: { message: error.message },
  });
});

// start the cron service to cache users games in the background
cron.cacheGames();

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

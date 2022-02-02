const express = require('express');
const app = express();
const logger = require('morgan');
const session = require('express-session');

const userRoutes = require('./api/routes/users');
const gameRoutes = require('./api/routes/games');

// allow dynamic port by host
const port = process.env.PORT || 3000;

// middleware - log out incoming requests
app.use(logger('dev'));
app.use(session({
    secret: process.env.SESSION_SECERET,
    resave: true,
    saveUninitialized: false,
    cookie: {secure: !true }
}))


// middleware - takes info passed in through the body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// middleware - adds headers to allow CORS.
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
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
        error: { message: error.message }
    });
});

app.listen(port, () => {
    console.log(`Listening on ${port}`)
})
const express = require('express');
const session = require('express-session');
const userRoutes = require('./routes/users');
const auth = require('./middleware/authenticated');

const app = express();

app.use(express.json()); //Make sure to send data as Content-Type: application/json to read it in req.body
app.use(session({
    secret: process.env.SESSION_SECERET,
    resave: true,
    saveUninitialized: false,
    cookie: { secure: !true }
}));
// needs to be last middleware called
app.use('/users', userRoutes);

// allow dynamic port by host
const port = process.env.PORT || 3000;

app.get('/', auth.isAuthenticated, (req, res, next) => {
    res.send('Game Day Manager!!!!!');
});

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});

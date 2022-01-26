const express = require('express');
const session = require('express-session');
const userRoutes = require('./routes/users');
const auth = require('./middleware/authenticated');

const app = express();

app.use(express.json()); //Make sure to send data as Content-Type: application/json to read it in req.body
app.use(session({
    secret: 'work hard',  // should be stored in a seceret at some point
    resave: true,
    saveUninitialized: false,
    cookie: { secure: !true }
}));
// needs to be last middleware called
app.use('/users', userRoutes);

app.listen(3000, () => {
    console.log("Listening on 3000");
});

// middleware routs
app.get('/', auth.isAuthenticated, (req, res, next) => {
    res.send('Game Day Manager!!!!!');
});

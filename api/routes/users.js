const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticated');
const dispayUser = require('../../dal/schemas/DisplayUser');
const dal = require('../../dal/dal');
require('dotenv/config');

const mongoose = require('mongoose');

const User = require('../../dal/schemas/User');
const userController = require('../controllers/userController');
const gameController = require('../controllers/gameController');
const bggController = require('../../bal/bggController')

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true });

router
    // Add a binding to handel /Users
    .get('/:bggUser', (req, res, next) => {
        
        res.status(200).send('Get User')
    })
    .get('/:bggUser/games', (req, res, next) => {
        res.status(200).send('Get User Games')
    } )
    .get('/logout', (req, res, next) => {
        if(req.session) {
            req.session.destroy(err => {
                if(err) {
                    return next(err);
                } else {
                    return res.redirect('/');
                }
            })
        }
    })
    .post('/', async (req, res, next) => {
        
    })
    .post('/login', (req, res, next) => {
        User.authenticate(req.body.BGGName, req.body.password, async function(error, user) {
            if(error || !user) {
                const err = new Error('Wrong bgg name or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id.toString();
                user.games = await getUsersGames(user);
                res.send(dispayUser.map(user));
                return user;
            }            
        })
    })
    .put('/', auth.isAuthenticated, (req, res, next) => {
        console.log(req.session);
        getUsersGames(req.body);
        res.send('Done');
    });

module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authenticated');
const dispayUser = require('../../schemas/DisplayUser');
require('dotenv/config');

const mongoose = require('mongoose');

const User = require('../../schemas/User');
const userController = require('../controllers/userController');
const gameController = require('../controllers/gameController');
const bggController = require('../controllers/bggController')

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true });

// This is used to make other sub-routes
//var someotherfolder = require('/someother/folder')

router
    // Add a binding to handel /Users
    .get('/:bggUser', (req, res, next) => {
        const bggName = req.params.bggUser;

        const user = findUser(bggName) // using regex to preform case insesitive search on bggName
        .then(doc => {
            if(doc === null) {
                res.statusCode = 404;
                res.send('No user found');
                return;
            }
            res.send(doc);
        })
        .catch(error => { 
            res.statusCode = 400;
            res.send('Error');
            console.error(error);
        });
    })
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
    .post('/', (req, res, next) => {
        if(req.body.BGGName && req.body.password) { // make sure required fields are there
            saveUser({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                BGGName: req.body.BGGName,
                password: req.body.password
            })
            .then(doc => 
                {
                    addUsersGames(doc);
                    req.session.userId = doc.id;
                    res.send(doc);
                })
            .catch(error => {
                console.error(error);
                if(error.code === 11000)
                {
                    res.statusCode = 409
                    res.send('BGG User alread exists');
                }
                else {
                    res.statusCode = 401;
                    res.send('User Not Created');
                }
            });
        }
        else {
            res.send('Something\'s wrong');
        }
    })
    .post('/login', (req, res, next) => {
        User.authenticate(req.body.BGGName, req.body.password, async function(error, user) {
            if(error || !user) {
                const err = new Error('Wrong bgg name or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id.toString();
                user.games = await addUsersGames(user);
                res.send(dispayUser.map(user));
                saveUser(user);
                return user;
            }            
        })
    })
    .put('/', auth.isAuthenticated, (req, res, next) => {
        console.log(req.session);
        addUsersGames(req.body);
        res.send('Done');
    })

    // Import any more 'user routes' as needed
    //.use('/folder', someotherfolder);
; // delete if adding more sub-routes

async function saveUser(user) {
    const u = new User(user);
    const doc = await u.save();

    return dispayUser.map(doc);
}

async function findUser(bggName) {
    const user = await User.findOne({ BGGName: new RegExp('\\b' + bggName + '\\b', 'i') });
    if(user === null) { return null; }
    return dispayUser.map(user);
}

async function addUsersGames(user) {
    bggUser = await bggController.getUserGames(user.BGGName);
    return bggUser.items.item.map(i => {
        return i._attributes.objectid;
    });
}

module.exports = router;

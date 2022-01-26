const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticated');
const dispayUser = require('../schemas/DisplayUser');

const connectionString = 'mongodb+srv://spuppett:DMbPnhZAbyGBy0mJ@cluster0.fm2oq.mongodb.net/gamedaymanagerdb?retryWrites=true&w=majority'
const mongoose = require('mongoose');

const User = require('../schemas/User');

mongoose.connect(connectionString, { useNewUrlParser: true });
const db = mongoose.connection;
// db.once('open', _ => {
//     console.log('DB Connected (user):', connectionString);
// })


// This is used to make other sub-routes
//var someotherfolder = require('/someother/folder')

router
    // Add a binding to handel /Users
    .get('/', (req, res, next) => {
        const bggName = req.body.BGGName;

        const user = findUser({ BGGName: new RegExp('\\b' + bggName + '\\b', 'i') }) // using regex to preform case insesitive search on bggName
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
    .post('/login', (req, res, next) => {
        User.authenticate(req.body.BGGName, req.body.password, function(error, user) {
            if(error || !user) {
                const err = new Error('Wrong bgg name or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id.toString();
                res.redirect('/');
            }
        })
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
                    req.session.userId = doc.id;
                    res.redirect('/');
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
    .put('/update', auth.isAuthenticated, (req, res, next) => {
        console.log(req.session);
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

async function findUser(query) {
    const user = await User.findOne(query);
    return dispayUser.map(user);
}

module.exports = router;

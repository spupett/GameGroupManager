const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticated');
const dispayUser = require('../../dal/schemas/DisplayUser');
const UserGameServices = require('../../services/userServices/getUserGameInfoFromBGG');
const UserService = require('../../services/userServices/getUserInfoFromBgg');
const UserServices = require('../../services/userServices/userServices');

require('dotenv/config');

const mongoose = require('mongoose');

const User = require('../../dal/schemas/User');
const userServices = require('../../services/userServices/userServices');

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true });

router
    .get('/:BGGName', async (req, res, next) => {
        const user = await UserService.getUserFromBgg(req.params.BGGName);
        res.status(200).send(user);
    })
    .get('/:BGGName/games', async (req, res, next) => {
        const usersGames = await UserGameServices.getGameIdsFromBgg(req.params.BGGName.toLowerCase());
        res.status(200).send(usersGames)
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
        try {
            const user = await UserServices.createUser(req.body);
            req.session.userId = user._id.toString();
            res.status(200).send(user);
        }
        catch(err) {
            console.log(err);
            res.status(400).send(err.message);
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
                res.status(200).send(user);
            }            
        })
    })
    .put('/', auth.isAuthenticated, (req, res, next) => {
        userServices.updateUser(req.body, req.session.userId);
        res.send('Done');
    })
    .delete('/:BGGName', auth.isAuthenticated, async (req, res, next) => {
        try {
            await userServices.deleteUser(req.params.BGGName, req.session.userId);
            if(req.session) {
                req.session.destroy(err => {
                    if(err) {
                        return next(err);
                    } else {
                        res.send('User deleted');
                    }
                })
            }
        } catch(error) {
            res.status(400).send(error.message);
        }
        
    });

module.exports = router;

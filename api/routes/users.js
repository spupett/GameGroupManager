const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticated');
const displayUser = require('../../dal/schemas/DisplayUser');
const UserGameServices = require('../../services/userServices/getUserGameInfoFromBGG');
const UserService = require('../../services/userServices/getUserInfoFromBgg');
const UserServices = require('../../services/userServices/userServices');

const User = require('../../dal/schemas/User');
const userServices = require('../../services/userServices/userServices');


router
    .get('/bggUser/:BGGName', async (req, res, next) => {
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
                    return res.status(200).send('Logged out');
                }
            })
        }
    })
    // Need to add a refresh route
    .post('/', async (req, res, next) => {
        try {
            const user = await UserServices.createUser(req.body);
            req.session.userId = user._id.toString();
            res.status(200).send(displayUser.map(user));
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
                res.status(200).send(displayUser.map(user));
            }            
        })
    })
    // Need to add another route to handle password special
    .put('/', auth.isAuthenticated, async (req, res, next) => {
        //TODO: makesure all these are present, make sure favorites is structured correctly
        const updateModel = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            favorites: req.body.favorites,
        }
        await userServices.updateUser(updateModel, req.session.userId);
        const user = await userServices.findUser(req.body.BGGName);
        res.send(displayUser.map(user));
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

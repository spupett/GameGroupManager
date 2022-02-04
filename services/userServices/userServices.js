const User = require('../../dal/schemas/User');
const dal = require('../../dal/dal');
const UserService = require('../../services/userServices/getUserInfoFromBgg');
const UserGameServices = require('../../services/userServices/getUserGameInfoFromBGG');

module.exports = {
    createUser: async (UserData) => {
        // fire off process to fetch BGG games in the background after creating
        if(UserData.BGGName && UserData.password) {
            const savedUser = await dal.findOne(User, UserData.BGGName)
            if(savedUser !== null) {
                throw new Error('User already Exists');
            }

            const bggUser = await UserService.getUserFromBgg(UserData.BGGName);
            if(bggUser._id === '') {
                throw new Error('BGG User Doesn\'t Exist');
            }
            const usersGameIds = await UserGameServices.getGameIdsFromBgg(UserData.BGGName.toLowerCase());
            const user = new User({
                firstName: UserData.firstName,
                lastName: UserData.lastName,
                email: UserData.email,
                BGGName: UserData.BGGName,
                password: UserData.password,
                games: usersGameIds
            })
            // get bgg game details in background
            dal.save(user) // don't really need to wait for this to save, since we have all the info
            return user;
        } else {
            throw new Error('Missing info, user not created');
        }
    },
    deleteUser: async (bggUser, sessionId) => {
        const userData = await dal.findById(User, sessionId);
        if(userData.BGGName === bggUser) {
            dal.delete(User, bggUser);
        } else {
            throw new Error('Cannot delete another user');
        }
    },
    updateUser: async (userData, sessionId) => {
        await dal.update(User, sessionId, userData);
    }
}
const User = require('../../dal/schemas/User');
const dal = require('../../dal/dal');
const UserService = require('../../services/userServices/getUserInfoFromBgg');
const UserGameServices = require('../../services/userServices/getUserGameInfoFromBGG');
const GameServices = require('../../services/gameServices/gameServices');

module.exports = {
  createUser: async (UserData) => {
    // fire off process to fetch BGG games in the background after creating
    if (UserData.BGGName && UserData.password) {
      const savedUser = await dal.findOne(User, UserData.BGGName);
      if (savedUser !== null) {
        throw new Error('User already Exists');
      }

      const bggUser = await UserService.getUserFromBgg(UserData.BGGName);
      if (bggUser._id === '') {
        throw new Error("BGG User Doesn't Exist");
      }
      const usersGameIds = await UserGameServices.getGameIdsFromBgg(
        UserData.BGGName.toLowerCase()
      );
      const user = new User({
        firstName: UserData.firstName,
        lastName: UserData.lastName,
        email: UserData.email,
        BGGName: UserData.BGGName,
        password: UserData.password,
        games: usersGameIds,
      });
      // get bgg game details in background
      dal.save(user); // don't really need to wait for this to save, since we have all the info
      return user;
    } else {
      throw new Error('Missing info, user not created');
    }
  },
  deleteUser: async (bggUser, sessionId) => {
    const userData = await dal.findById(User, sessionId);
    if (userData.BGGName === bggUser) {
      dal.delete(User, bggUser);
    } else {
      throw new Error('Cannot delete another user');
    }
  },
  updateUser: async (userData, sessionId) => {
    await dal.update(User, sessionId, userData);
  },
  findUser: async (bggUser) => {
    const user = await dal.findOne(User, bggUser.toLowerCase());
    return user;
  },
  findUserByEmail: async (email) => {
    const user = await dal.findByEmail(User, email);
    return user;
  },
  findByGoogleId: async (google_Id) => {
    const user = await dal.find(User, { googleId: google_Id });
    console.log('User', user);
    return user;
  },
  getUsersGames: async (users) => {
    const userData = await Promise.all(
      users.map((user) => {
        return dal.findOne(User, user.toLowerCase());
      })
    );

    const userGames = userData.map((data) => {
      return {
        users: data.BGGName,
        gameNumbers: data.games,
      };
    });

    return userGames;
  },
  refreshGameList: async (user, sessionId) => {
    // fire off get games from bgg
    const usersGames = await UserGameServices.getGameIdsFromBgg(
      user.BGGName.toLowerCase()
    );
    user.games = usersGames;
    GameServices.saveGameDetails(user.games);
    const games = module.exports.updateUser(user, sessionId);
    return user;
  },
};

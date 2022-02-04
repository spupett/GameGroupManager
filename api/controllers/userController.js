const User = require('../../dal/schemas/User');
const GameUtil = require('../../services/game');

const controller = {
  getUsers: (dbFetch) => {
    return dbFetch(User).then((dbResults) => {
      const users = JSON.parse(JSON.stringify(dbResults));
      return users.map((user) => {
        return {
          bggName: user.bggName,
          firstName: user.firstName,
          lastName: user.lastName,
        };
      });
    });
  },

  getUser: (userName, dbFetch) => {
    return dbFetch(User, userName)
      .then((dbResults) => {
        // if there is a result for the DB, return it.
        if (dbResults) {
          const user = JSON.parse(JSON.stringify(dbResults));
          user.found = 'database';
          user.urls = { gameList: `/api/v1/${userName}/games` };
          return user;
        } else {
          return null;
        }
      })
      .catch((error) => {
        throw error;
      });
  },

  signup: async (userData) => {
    console.log(userData);
    if (userData.BGGName === '') {
      const error = new Error('No user name given');
      error.status = 400;
      throw error;
    }
    if (userData.password === '') {
      const error = new Error('No Password given');
      error.status = 400;
      throw error;
    }
    if (userData.email === '') {
      const error = new Error('No Email given');
      error.status = 400;
      throw error;
    }
    const gameList = await GameUtil.getNewGamesToAdd(
      userData.BGGName
    );
    console.log(gameList);
  },

  getUserGames: (userName, wsFetch) => {
    // but for now, I really just want to get the ws working.
    return wsFetch(userName).then((results) => {
      return results;
    });
  },
};

module.exports = controller;

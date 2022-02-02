const User = require('../../schemas/User');

const controller = {
    getUsers: (dbFetch) => {
        return dbFetch(User)
            .then((dbResults) => {
                const users = JSON.parse(JSON.stringify(dbResults));
                return users.map((user) => {
                    return { 'bggName': user.bggName, 'firstName': user.firstName, 'lastName': user.lastName };
                });
            })
    },

    getUser: (userName, dbFetch) => {
      return dbFetch(User, userName)
        .then((dbResults) => {
          // if there is a result for the DB, return it.
          if (dbResults) {
            const user = JSON.parse(JSON.stringify(dbResults));
            user.found = 'database';
            user.urls = { gameList: `/api/v1/${userName}/games` }
            return user
          } else {
            return null
          }
        })
        .catch((error) => { throw error; })
    },

    signup: (userData, dbFetch, dbAdd, hashingFunction) => {
      console.log(userData)
      if (!(userData.hasOwnProperty('userName')) || userData.userName === ''){
        const error = new Error('No user name given')
        error.status = 400
        throw error
      }
      if (!userData.hasOwnProperty('password') || !userData.password === '') {
        const error = new Error('No Password given')
        error.status = 400
        throw error
      }
      if (!userData.hasOwnProperty('email') || !userData.email === '') {
        const error = new Error('No Email given')
        error.status = 400
        throw error
      }
      return controller.getUser(userData.userName, dbFetch)
        .then((results) => {
          if (results === null) {
            const user = new User({
              bggName: userData.bggName,
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              userName: userData.userName,
              hash: hashingFunction(userData.password)
            });
            return dbAdd(user)
          }
          if (results.found === 'database') {
            return results;
          }
      });
    },

    getUserGames: (userName, wsFetch) => {
        // but for now, I really just want to get the ws working.
        return wsFetch(userName)
            .then((results) => {
                return results;
            });
    }
}

module.exports = controller;
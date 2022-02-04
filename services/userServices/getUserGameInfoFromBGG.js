const bgg = require('../../bal/bggInterface');
const convert = require('../../services/conversion/convertFromBGG');

module.exports = {
  getUsersGamesFromBgg: (bggUser) => {
    const games = bgg
      .getUserGames(bggUser)
      .then((games) => {
        const usersGames = convert.convertGameListData(games);
        return usersGames;
      })
      .catch((error) => {
        throw new Error(error);
      });

    return games;
  },

  getGameIdsFromBgg: (bggUser) => {
    const gameList = module.exports
      .getUsersGamesFromBgg(bggUser)
      .then((gameList) => {
        const list = gameList.map((game) => game.id);
        return list;
      });
    return gameList;
  },
};

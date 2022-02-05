const bal = require('../../bal/bggInterface');
const dal = require('../../dal/dal');
const Game = require('../../dal/schemas/Game');
const convert = require('../../services').Convert;

module.exports = {
  getGameDetails: async (games) => {
    if (!Array.isArray(games)) {
      throw new Error('Must pass in array');
    }

    gamesList = games.join(',');
    const details = await bal.getGames(gamesList);
    return details;
  },

  saveGameDetails: async (gameIdList) => {
    if (!Array.isArray(gameIdList)) {
      throw new Error('Must pass in array');
    }

    const allGames = (await dal.find(Game, {}, '-_id bggId')).map(
      (obj) => obj.bggId
    );
    const newGames = gameIdList.filter((g) => !allGames.includes(g));

    if (newGames.length > 0) {
      const newGameDetails = await module.exports.getGameDetails(newGames);
      const mappedDetails = convert.convertGameDetail(newGameDetails);
      mappedDetails.forEach((game) => {
        dal.save(
          new Game({
            name: game.name,
            bggId: game.bggId,
            thumbnail: game.thumbnail,
            image: game.image,
            playerCount: game.playerCount,
            playTime: game.playTime,
            category: game.category,
            mechanics: game.mechanics,
            bggLink: game.bggLink,
            description: game.description,
          })
        );
      });
    }
  },
};

const cron = require('node-cron');
const gameUtil = require('../services/game');
const gameController = require('../api/controllers/gameController');

require('dotenv/config');

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
});

// * * * * *  <- defaults to once a minute.
// | | | | |
// | | | | day of week
// | | | month
// | | day of month
// | hour
// minute

const jobs = {
  cacheGames: () => {
    cron.schedule('15 */3 * * *', async () => {
      //15 */3 * * *
      console.log('Getting Users Games', new Date(Date.now()));

      try {
        const gameList = await gameUtil.getNewGamesToAdd();
        const gameDetails = await gameController.getGames(gameList);

        if (gameDetails.length > 0) {
          console.log(`New game details to add: ${gameDetails.length}`);
          gameController.saveGames(gameDetails);
        } else {
          console.log('No new game details to add');
        }
      } catch (error) {
        console.log(error);
      }
    });
  },
};

module.exports = jobs;

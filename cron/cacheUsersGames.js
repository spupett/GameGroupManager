const cron = require('node-cron');
const gameUtil = require('../util-modules/game');
const gameController = require('../api/controllers/gameController');

require('dotenv/config');

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true });

// * * * * * *  <- defaults to once a minute.
// | | | | | |
// | | | | | day of week
// | | | | month
// | | | day of month
// | | hour
// | minute
// second ( optional )

const jobs = {
    cacheGames: () => {
        cron.schedule('*/5 * * * *', async () => { //* * 1,15 * *
            console.log('Getting Users Games');
            
            try {
                const gameList = await gameUtil.getNewGamesToAdd();
                const gameDetails = await gameController.getGames(gameList);
                gameController.saveGames(gameDetails);
            }
            catch(error) {
                console.log(error);
            }
            
        })
    }
}

module.exports = jobs;
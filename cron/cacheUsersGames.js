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


cron.schedule('*/5 * * * *', async () => { //* * 1,15 * *
    console.log('Running a task');
    
    try {
        const gameList = await gameUtil.getNewGamesToAdd();
        const gameDetails = await gameController.getGames(gameList);
        console.log(gameDetails);
        gameController.saveGames(gameDetails);
    }
    catch(error) {
        console.log(error);
    }
    
})
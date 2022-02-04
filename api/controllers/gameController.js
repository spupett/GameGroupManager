const Game = require('../../dal/schemas/Game');
const Convert = require('../../services').Convert;
const Mask = require('../../services').Mask;
const bggController = require('../../bal/bggInterface');
const DAL = require('../../dal/dal');

const getAllGames = async(gameIds) => {
    let allGames = [];
    const gamesFromDB = await getGamesFromDB(gameIds);
    const dbIds = gamesFromDB.map((game) => {
        return game.bggId;
    });
    const newGameIds = gameIds.filter((id) => {
        return dbIds.indexOf(id) === -1;
    });
    if (newGameIds.length > 0) {
        const gamesFromWS = await getGamesFromWS(newGameIds);
        if (gamesFromWS.items.item) {
            newGames = Convert.convertGameDetail(gamesFromWS);
            allGames = gamesFromDB.concat(newGames);
        } else {
            return null;
        }
    } else {
        allGames = gamesFromDB;
    }
    return allGames.map((game) => {
        return Mask.maskGameDetail(game);
    })
}

const getGamesFromDB = (gameIds) => {
    return foundGames = DAL.find(Game, { bggId: gameIds });
}

const getGamesFromWS = (gameIds) => {
    return bggController.getGames(gameIds);
}

const saveNewGames = async(games) => {
    games.forEach((game) => {
        DAL.save(new Game({
            name: game.name,
            bggId: game.bggId,
            thumbnail: game.thumbnail,
            image: game.image,
            playerCount: game.playerCount,
            playTime: game.playTime,
            category: game.category,
            mechanics: game.mechanics,
            bggLink: game.bggLink,
            description: game.description
        }));
    })
}

const controller = {
    getGame: async(gameId) => {
        return controller.getGames([gameId]);
    },

    getGames: async(gameIds) => {
        if (!Array.isArray(gameIds)) { return getAllGames([gameIds]) }
        return getAllGames(gameIds);
    },

    saveGames: async(games) => {
        saveNewGames(games);
    }
};

module.exports = controller;
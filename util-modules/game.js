const gameController = require('../api/controllers/gameController');
const dal = require('../api/DAL/dal');
const User = require('../schemas/User');
const Game = require('../schemas/Game');

const NewGames = {
    getUsersGames: getAllUsersGames,

    getNewGamesToAdd: getGamesToAdd
}


async function getAllUsersGames() {
    console.log('getting all users games');
    var list = await dal.find(User, { games: { $exists: true, $type: 'array', $ne: [] }});
    const combinedList = list.reduce((accumulator, currentValue) => {
        var games = currentValue.games.map((game) => {
            return game;
        })
        return accumulator.concat(games);
    }, [])
    const unique = combinedList.filter((v, i, a) => a.indexOf(v) === i);

    return unique;
}

async function getGamesToAdd(bggUser) {
    console.log('getting new games to add');
    const usersGames = !bggUser ? await getAllUsersGames() : (await dal.findOne(User, bggUser)).map(user => user.games);
    const savedGames = (await dal.find(Game, {})).map( game => { return game.bggId; });
    
    const newGames = usersGames.filter(id => {
        return savedGames.indexOf(id) === -1;
    })
    return newGames;
}

module.exports = NewGames;
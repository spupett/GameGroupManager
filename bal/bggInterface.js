const axios = require('axios');
const jsConvert = require('xml-js');

function getDataFromBGG(url) {
  return axios.get(url).then((response) => {
    return JSON.parse(jsConvert.xml2json(response.data, { compact: true, spaces: 4 }));
  });
}

// These all return promises
module.exports = {
  getUser: (userName) => {
    const URL = `https://www.boardgamegeek.com/xmlapi2/user?name=${userName}`;
    return getDataFromBGG(URL);
  },

  getGames: (gameId) => {
    const URL = `https://www.boardgamegeek.com/xmlapi2/thing?&id=${gameId}`;
    return getDataFromBGG(URL);
  },

  getUserGames: (userName) => {
    const URL = `https://www.boardgamegeek.com/xmlapi2/collection?own=1&username=${userName}`;
    return getDataFromBGG(URL);
  }
}
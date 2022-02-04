const bgg = require('../../bal/bggInterface');
const convert = require('../../services/conversion/convertFromBGG');

module.exports = {
  getUserFromBgg: async (bggUser) => {
    return convert.convertUser(await bgg.getUser(bggUser));
  },
};

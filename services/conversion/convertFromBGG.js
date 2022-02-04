function findBestPlayerNumber(poll) {
  if (!Array.isArray(poll)) {
    return '0';
  }
  const best = poll
    .map((pc) => {
      return {
        numberPlayers: pc._attributes.numplayers,
        best: pc.result.filter((b) => {
          return b._attributes.value === 'Best';
        })[0]._attributes.numvotes,
      };
    })
    .reduce((acc, cur) => {
      acc[0] =
        acc[0] === undefined || Number(cur.best) < Number(acc[0].best)
          ? cur
          : acc[0];
      acc[1] =
        acc[1] === undefined || Number(cur.best) > Number(acc[1].best)
          ? cur
          : acc[1];
      return acc;
    }, [])[1];
  return best.numberPlayers;
}

module.exports = {
  convertUser: (bggUserData) => {
    return {
      bggName: bggUserData.user._attributes.name,
      firstName: bggUserData.user.firstname._attributes.value,
      lastName: bggUserData.user.lastname._attributes.value,
      email: '',
      _id: bggUserData.user._attributes.id,
    };
  },

  convertGameListData: (bggGameListData) => {
    return (gameList = bggGameListData.items.item.map((item) => {
      let game = {};
      try {
        game = {
          name: item.name._text,
          thumbnail: item.thumbnail ? item.thumbnail._text : '',
          id: item._attributes.objectid,
        };
      } catch (error) {
        console.log(item);
      }
      return game;
    }));
  },

  convertGameDetail: (bggGameData) => {
    const convert = (bggData) => {
      const convertedGame = {
        name: Array.isArray(bggData.name)
          ? bggData.name[0]._attributes.value
          : bggData.name._attributes.value,
        bggId: bggData._attributes.id,
        thumbnail: bggData.thumbnail ? bggData.thumbnail._text : '',
        image: bggData.image ? bggData.image._text : '',
        playTime: Number(bggData.playingtime._attributes.value),
        description: bggData.description._text,
        bggLink: `https://www.boardgamegeek.com/boardgame/${bggData._attributes.id}`,
        playerCount: {
          min: Number(bggData.minplayers._attributes.value),
          max: Number(bggData.maxplayers._attributes.value),
          best: findBestPlayerNumber(
            bggData.poll.filter((poll) => {
              return poll._attributes.name === 'suggested_numplayers';
            })[0].results
          ),
        },
        category: bggData.link
          .filter((attr) => {
            return attr._attributes.type === 'boardgamecategory';
          })
          .map((attr) => {
            return attr._attributes.value;
          }),
        mechanics: bggData.link
          .filter((attr) => {
            return attr._attributes.type === 'boardgamemechanic';
          })
          .map((attr) => {
            return attr._attributes.value;
          }),
        display: true,
      };

      if (convertedGame.mechanics === undefined) {
        convertedGame.mechanics = [];
      }
      if (convertedGame.category === undefined) {
        convertedGame.category = [];
      }

      return convertedGame;
    };

    if (!Array.isArray(bggGameData.items.item)) {
      return [convert(bggGameData.items.item)];
    } else {
      return (games = bggGameData.items.item.map(convert));
    }
  },
};

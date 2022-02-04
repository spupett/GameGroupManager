const UserServices = require('../../services/userServices/userServices');

function intersection(a) {
  console.log(a);
  if (a.length > 2)
    return intersection([
      intersection(a.slice(0, a.length / 2)),
      intersection(a.slice(a.length / 2)),
    ]);

  if (a.length == 1) return a[0];

  return a[0].filter(function (item) {
    return a[1].indexOf(item) !== -1;
  });
}

module.exports = {
  getGroupGameNumbers: async (users) => {
    const usersGames = await UserServices.getUsersGames(users);

    const combinedList = usersGames.reduce(
      (accumulator, currentValue) => {
        return accumulator.concat(currentValue.gameNumbers);
      },
      []
    );

    const justGames = usersGames.map((data) => {
      return data.gameNumbers;
    });

    const sameGames = intersection(justGames);
    const unique = combinedList.filter(
      (v, i, a) => a.indexOf(v) === i
    );
    let obj = {
      UniqueGames: unique,
      UsersGames: usersGames,
      SameGames: sameGames,
    };

    return obj;
  },
};

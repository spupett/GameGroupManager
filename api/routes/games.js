const express = require('express');
const router = express.Router();

const gameController = require('../controllers/gameController');

router.get('/:bggId', (req, res, next) => {
  gameController.getGame(req.params.bggId).then((game) => {
    res.status(200).json(game);
  });
});

router.post('/', (req, res, next) => {
  gameController
    .getGames(JSON.parse(req.body.gameList))
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ Error: { message: error } });
    });
});

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const Convert = require('../../util-module').Convert;

// const userController = require('../controllers/userController');
// const bggController = require('../controllers/bggController');
// const DAL = require('../DAL/dal');

// const getBggUser = (user) => {
//     return bggController.getUser(user).then((data) => {
//         return Convert.convertUser(data);
//     });
// }

// const getUsersGames = (user) => {
//     return bggController.getUserGames(user).then((data) => {
//         return Convert.convertGameListData(data);
//     })
// }

// router.get('/', (req, res, next) => {
//     userController.getUsers(DAL.find)
//         .then((results) => {
//             res.status(200).json(results);
//         })
//         .catch((error) => {
//             console.log(error);
//             res.status(500).json({ Error: { message: error } })
//         });
// })

// router.get('/:userName', (req, res, next) => {
//     userController.getUser(req.params.userName, req.params.password, DAL.findOne, getBggUser)
//         .then((result) => {
//             res.status(200).json(result);
//         })
//         .catch((error) => {
//             console.log(error);
//             res.status(500).json({ Error: { message: error } })
//         });
// });

// router.get('/:userName\/games', (req, res, next) => {
//     userController.getUserGames(req.params.userName, () => {}, getUsersGames)
//         .then((result) => {
//             res.status(200).json(result);
//         })
//         .catch((error) => {
//             console.log(error);
//             res.status(500).json({ Error: { message: error } })
//         });
// });

// router.put('/:userName', (req, res, next) => {
//     const User = require('../models/user');
//     DAL.update(User, { bggName: req.params.userName }, req.body)
//         .then((result) => {
//             res.status(201).json(result);
//         })
//         .catch((error) => {
//             console.log(error);
//             res.status(500).json({ Error: { message: error } })
//         })
// });

// router.delete('/:userName', (req, res, next) => {
//     const User = require('../models/user');
//     DAL.delete(User, req.params.userName)
//         .then((result) => {
//             res.status(201).json(result);
//         })
//         .catch((error) => {
//             console.log(error);
//             res.status(500).json({ Error: { message: error } })
//         });
// });

// router.post('/signup', (req, res, next) => {
//   console.log('signup', req.body)
//   res.status(200).json({'message': 'OK'})
// })

// module.exports = router;

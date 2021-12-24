const express = require('express');
const router = express.Router();
const auth = require('../app/middlewares/auth');
const LevelController = require('../app/controllers/LevelController');

router.get('/', auth, LevelController.home);

router.post('/grant_user', auth, LevelController.grantUser);

router.post('/grant_code', auth, LevelController.grantCode);

router.post('/grant_privileges_cities', auth, LevelController.grantPrivilegesForCities);

router.post('/grant_privileges_below', auth, LevelController.grantPrivilegesForBelowLevel);

module.exports = router;
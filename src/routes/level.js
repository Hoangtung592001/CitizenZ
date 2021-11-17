const express = require('express');
const router = express.Router();
const auth = require('../app/middlewares/auth');
const LevelController = require('../app/controllers/LevelController');

router.get('/', LevelController.home);

router.post('/decentralize_for_cities', auth, LevelController.decentralizeForCities);

module.exports = router;
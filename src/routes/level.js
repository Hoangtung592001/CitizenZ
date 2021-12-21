const express = require('express');
const router = express.Router();
const auth = require('../app/middlewares/auth');
const LevelController = require('../app/controllers/LevelController');

router.get('/', LevelController.home);

router.post('/decentralize_for_cities', auth, LevelController.decentralizeForCities);

router.post('/decentralize_for_districts', auth, LevelController.decentralizeForDistricts);

router.post('/decentralize_for_wards', auth, LevelController.decentralizeForWards);

router.post('/decentralize_for_villages', auth, LevelController.decentralizeForVillages);

router.post('/grant_code', auth, LevelController.grantCode);

module.exports = router;
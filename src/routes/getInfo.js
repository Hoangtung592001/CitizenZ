const express = require('express');
const router = express.Router();
const auth = require('../app/middlewares/auth');

const getInfoController = require('../app/controllers/GetInfoController');

router.get('/get_info_by_search/:searchValue', auth, getInfoController.getInfoBySearch);

router.get('/analyse_population', auth, getInfoController.analysePopulation);

module.exports = router;
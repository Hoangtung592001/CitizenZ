const express = require('express');
const router = express.Router();
const auth = require('../app/middlewares/auth');

const getInfoController = require('../app/controllers/GetInfoController');

router.get('/get_info_by_search/:searchValue', auth, getInfoController.getInfoBySearch);

router.post('/analyse_population', auth, getInfoController.analysePopulation);

router.get('/user_info', auth, getInfoController.getUserInfo);

router.get('/granted_user', auth, getInfoController.gratedUser);

router.get('/granted_time_user', auth, getInfoController.grantedTimeUser);

router.get('/get_info_levels/:id', getInfoController.getInfoLevel);

module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require('../app/middlewares/auth');

const InformationController = require('../app/controllers/InfoLevelController');

router.get('/get_info_levels/:id', auth, InformationController.getInfoLevels)

module.exports = router;
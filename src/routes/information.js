const express = require('express');
const router = express.Router();
const auth = require('../app/middlewares/auth');

const informationController = require('../app/controllers/InformationController');

router.get('/', informationController.home);

router.post('/declaration', auth,  informationController.declaration);

router.put('/change_info', informationController.changeInfo);

module.exports = router;
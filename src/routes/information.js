const express = require('express');
const router = express.Router();

const informationController = require('../app/controllers/InformationController');

router.get('/', informationController.home);

router.post('/declaration', informationController.declaration);

router.put('/change_info', informationController.changeInfo);

module.exports = router;
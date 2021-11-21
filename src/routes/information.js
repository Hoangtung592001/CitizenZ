const express = require('express');
const router = express.Router();
const auth = require('../app/middlewares/auth');

const informationController = require('../app/controllers/InformationController');

router.get('/', informationController.home);

router.post('/declaration', auth,  informationController.declaration);

router.put('/change_info/:citizen_id', auth, informationController.changeInfo);


router.get('/get_info_citizen_cities', auth, informationController.getInfoCitizenOfCities);
module.exports = router;
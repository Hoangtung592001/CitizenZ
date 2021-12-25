const express = require('express');
const router = express.Router();
const auth = require('../app/middlewares/auth');

const informationController = require('../app/controllers/InformationController');

router.get('/get_ethnic_groups', informationController.getEthnicGroups)

router.get('/get_countries', informationController.getCountries);

router.get('/test', auth, informationController.test);

router.post('/declaration', auth,  informationController.declaration);

router.get('/declaration', auth, informationController.declarationSite);

router.post('/declarationByB1', auth,  informationController.declarationByB1);

router.get('/declarationByB1', auth,  informationController.declarationByB1Site);

// router.get('/declarationByB1', auth, informationController.declarationByB1Site);

router.get('/change_info_by_b1/:citizen_id', auth, informationController.changeInfoByB1Site);

router.put('/change_info_by_b1/:citizen_id', auth, informationController.changeInfoByB1);

router.get('/change_info_by_b2/:citizen_id', auth, informationController.changeInfoByB2Site);

router.put('/change_info_by_b2/:citizen_id', auth, informationController.changeInfoByB2);

router.get('/get_info_citizen_cities', auth, informationController.getInfoCitizenOfCities);

router.delete('/delete_citizen/:citizen_id', auth, informationController.deleteCitizen);

// router.get('/confirm_changeInfo', auth, informationController.confirmChangeInfo);

router.post('/declaringDone', auth, informationController.declaringDone);

router.get('/', informationController.home);

module.exports = router;
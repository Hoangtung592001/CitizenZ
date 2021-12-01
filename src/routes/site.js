const express = require('express');
const router = express.Router();
const auth = require('../app/middlewares/auth');
const SiteController = require('../app/controllers/SiteController');

// router.post('/:productCode/comment', isLoggedIn, buyingController.comment);
router.patch('/confirm_reset_password', SiteController.forgetPassword);

router.get('/all_city', auth, SiteController.getCities);

router.get('/:city_id/city', auth, SiteController.getDistricts);

router.get('/:district_id/district', auth, SiteController.getWards);

router.get('/:ward_id/ward', auth, SiteController.getVillages);

router.get('/:village_id/citizen', auth, SiteController.getCitizens);

router.get('/', SiteController.login_site);

router.get('/logout', auth, SiteController.logout_site);

router.get('/forget_password', SiteController.forgetPasswordSite);

router.get('/reset_password/:username', SiteController.resetPassWordSite);

router.post('/signup', SiteController.signup);

router.post('/login', SiteController.login);

router.post('/forget_password', SiteController.sendMessageConfirmResetPassword);

router.get('/:id', SiteController.getData);

module.exports = router;
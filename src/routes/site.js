const express = require('express');
const router = express.Router();

const SiteController = require('../app/controllers/SiteController');

// router.post('/:productCode/comment', isLoggedIn, buyingController.comment);

router.get('/', SiteController.home);

router.post('/signup', SiteController.signup);

router.post('/login', SiteController.login);

router.post('/confirm_forget_password', SiteController.confirmForgetPassword);

router.post('/forget_password', SiteController.sendMessageConfirmResetPassword);

router.put('/reset_password', SiteController.forgetPassword);

module.exports = router;
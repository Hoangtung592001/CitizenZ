const UserService = require('../dbserver/UserService');
const EncryptService = require('../service/encryptService');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Validate = require('../service/validate');
const sendByMail = require('../service/sendMessagesThroughGmail');
const FindLocationService = require('../dbserver/FindLocationService');
class SiteController {
    getCities(req, res, next) {
        const user = req.user.user;
        if (user.role !== 'A1') {
            return res.status(403).json({
                error: true,
                msg: 'Người dùng không có quyền truy cập miền này!'
            })
        }
        FindLocationService.getCitiesInfo()
            .then(cities => {
                // res.json(cities);
                res.render('site/cities', { cities });
            })
    }

    getDistricts(req, res, next) {
        const user = req.user.user;
        if (user.role !== 'A1' 
            && user.role !== 'A2') {
            return res.status(403).json({
                error: true,
                msg: 'Người dùng không có quyền truy cập miền này!'
            })
        }
        const city_id = req.params.city_id;
        if (city_id.search(user.username) === -1 && user.role != 'A1') {
            return res.status(404).json({
                error: true,
                msg: 'Người dùng không có quyền truy cập miền này!'
            })
        }
        FindLocationService.getInfoOfLevels(city_id)
            .then(districts => {
                // res.json(districts);
                res.render('site/districts', { districts });
            })
    }

    getWards(req, res, next) {
        const user = req.user.user;
        if (user.role !== 'A1' && user.role !== 'A2' 
            && user.role !== 'A3') {
            return res.status(403).json({
                error: true,
                msg: 'Người dùng không có quyền truy cập miền này!'
            })
        }
        const district_id = req.params.district_id;
        if (district_id.search(user.username) === -1 && user.role != 'A1') {
            return res.status(404).json({
                error: true,
                msg: 'Người dùng không có quyền truy cập miền này!'
            })
        }
        FindLocationService.getInfoOfLevels(district_id) 
            .then(wards => {
                // res.json(wards);
                res.render('site/wards', { wards });
            })
    }

    getVillages(req, res, next) {
        const user = req.user.user;
        if (user.role !== 'A1' && user.role !== 'A2' 
            && user.role !== 'A3' && user.role !== 'B1') {
            return res.status(403).json({
                error: true,
                msg: 'Người dùng không có quyền truy cập miền này!'
            })
        }
        const ward_id = req.params.ward_id;
        if (ward_id.search(user.username) === -1 && user.role != 'A1') {
            return res.status(404).json({
                error: true,
                msg: 'Người dùng không có quyền truy cập miền này!'
            })
        }
        FindLocationService.getInfoOfLevels(ward_id) 
            .then(villages => {
                // res.json(villages)
                res.render('site/villages', { villages });
            })
    }

    getCitizens(req, res, next) {
        const user = req.user.user;
        if (user.role !== 'A1' && user.role !== 'A2' && user.role !== 'A3' 
            && user.role !== 'B1' && user.role !== 'B2') {
            return res.status(403).json({
                error: true,
                msg: 'Người dùng không có quyền truy cập miền này!'
            })
        }
        const village_id = req.params.village_id;
        if (village_id.search(user.username) === -1 && user.role != 'A1') {
            return res.status(404).json({
                error: true,
                msg: 'Người dùng không có quyền truy cập miền này!'
            })
        }
        FindLocationService.getInfoOfLevels(village_id) 
            .then(citizens => {
                // res.json(citizens)
                res.render('site/citizens', { citizens });
            })
    }

    getData(req, res, next) {
        const id = req.params.id;
        FindLocationService.getInfoOfLevels(id)
            .then(data => {
                return res.json(data);
            }) 
    }

    login_site(req, res, next) {
        res.render('login');
    }

    async signup(req, res, next) {
        try {
            const user = req.body;
            user.role = 'A1';
            UserService.addUser(user)
                .then(created => {
                    res.status(201).json({
                        error: false,
                        msg: 'Đăng kí tài khoản thành công',
                        user
                    });
                })
                .catch(err => {
                    res.status(400).json({
                        error: true,
                        msg: 'Đăng kí tài khoản thất bại!',
                        user
                    });
                })
        }
        catch(err) {
            res.status(500).send('server error ' + err.message);
        }
    }

    async login(req, res, next) {
        try {
            const user = req.body;
            Validate.user(user)
                .then(async data => {
                    if (data.error) {
                        return res.json(data);
                    }
                    const payload = {
                        user: {
                            username: data.userInDb.username,
                            role: data.userInDb.role
                        }
                    }
                    const accessToken = jwt.sign(
                        payload,
                        process.env.AUTH_SECRET,
                    )
                    res.cookie('token', accessToken);
                    const username = data.userInDb.username;
                    if (username.length === 2) {
                        res.redirect(`/${username}/city`);
                    }
                    else if (username.length === 4) {
                        res.redirect(`/${username}/district`);
                    }
                    else if (username.length === 6) {
                        res.redirect(`/${username}/ward`);
                    }
                    else if (username.length === 8) {
                        res.redirect(`/${username}/citizen`);
                    }
                    else {
                        res.redirect('/all_city');
                    }
                })
        }
        catch(err) {
            res.status(500).send('server error ' + err.message);
        }
    }

    logout_site(req, res, next) {
        res.clearCookie('token');
        res.redirect('/');
    }

    /*
    const CryptoJS = require("crypto-js");
    var ciphertext = CryptoJS.AES.encrypt('nhtung5901', '123').toString();
    console.log(ciphertext);
    // Decrypt
    var bytes = CryptoJS.AES.decrypt(ciphertext, '123');
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    console.log(originalText);
    */

    async sendMessageConfirmResetPassword(req, res, next) {
        const { username } = req.body;
        UserService.getUserByUsername(username)
            .then(async data => {
                if (!data[0]) {
                    return res.json({
                        error: true,
                        msg: 'Tài khoản này không tồn tại!'
                    })
                }
                const payload = {
                    user: {
                        username: data[0].username
                    }
                }
                jwt.sign(
                    payload,
                    process.env.CONFIRM_PASSWORD_KEY,
                    {
                        expiresIn: 3600000000,
                    },
                    (err, token) => {
                        if (err) throw err;
                        const subject = 'Gửi mã xác nhận đổi mật khẩu';
                        sendByMail.confirmChangePassword(
                            subject,
                            `${process.env.CLIENT_URL}reset_password/${token}`
                        )
                        .then(isSent => {
                            if (!isSent) {
                                return res.json({
                                    error: true,
                                    msg: 'Gửi mã xác nhận thất bại!'
                                })
                            }
                            res.json({
                                error: false,
                                msg: 'Gửi mã xác nhận thành công!'
                            })
                        })
                    })
            })
    }

    async forgetPassword(req, res, next) {
        let payload = req.body.username;
        jwt.verify(payload, process.env.CONFIRM_PASSWORD_KEY, async (err, payload) => {
            if (err) {
                return res.json(err.message);
            }
            const username = payload.user.username;
            let newPassword = req.body.newPassword;
            newPassword = await EncryptService.encryptSingle(newPassword);
            UserService.setPassword(username, newPassword)
                .then(isChanged => {
                    if (!isChanged) {
                        return res.json({
                            error: true,
                            msg: 'Chưa đổi được mật khẩu!'
                        })
                    }
                    res.json({
                        error: false,
                        msg: 'Đổi mật khẩu thành công!'
                    })
                })
        });
    }

    resetPassWordSite(req, res, next) {
        res.render('site/resetPassword');
    }

    forgetPasswordSite(req, res, next) {
        res.render('site/forgetPassword');
    }
}

module.exports = new SiteController();

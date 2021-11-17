const UserService = require('../dbserver/UserService');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const Validate = require('../service/validate');
const sendByMail = require('../service/sendMessagesThroughGmail');
class SiteController {
    home(req, res, next) {
        res.send('CitizenZ');
    }

    async signup(req, res, next) {
        try {
            const user = req.body;
            UserService.getUserByUsername(user.username)
                .then(async data => {
                    if (data[0]) {
                        return res.status(400).json({
                            error: true,
                            msg: 'Tài khoản đã tồn tại!',
                        });
                    }
                    user.role = 'A1';
                    UserService.addUser(user)
                        .then(created => {
                            if (!created) {
                                return res.status(400).json({
                                    error: true,
                                    msg: 'Chưa đăng kí được tài khoản',
                                });
                            }
                            res.status(201).json({
                                error: false,
                                msg: 'Đăng kí tài khoản thành công',
                                user
                            });
                        })
                });
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
                    jwt.sign(
                        payload,
                        process.env.AUTH_SECRET,
                        // {
                        //     expiresIn: 36000,
                        // },
                        (err, token) => {
                            if (err) throw err;
                            const options = {
                                expires: new Date(
                                    Date.now() +
                                        process.env.COOKIE_EXPIRE *
                                            24 *
                                            60 *
                                            60 *
                                            1000,
                                ),
                                httpOnly: true,
                            };
                            return res
                                    .status(200)
                                    .cookie('token', token, options)
                                    .json({
                                        error: false,
                                        token,
                                        user: data.userInDb.username,
                                    });
                        }
                    )
                })
        }
        catch(err) {
            res.status(500).send('server error ' + err.message);
        }
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
                        expiresIn: 36000,
                    },
                    (err, token) => {
                        if (err) throw err;
                        const subject = 'Gửi mã xác nhận đổi mật khẩu';
                        sendByMail.confirmChangePassword(
                            subject,
                            `${process.env.CLIENT_URL}confirmChangePassword/${token}`
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

    async confirmMessageResetPassword(req, res, next) {

    }

    async forgetPassword(req, res, next) {
        const { username } = req.body;
        let { newPassword } = req.body;
        const salt = await bcrypt.genSalt(10);
        newPassword = await bcrypt.hash(newPassword, salt);
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
    }



    async confirmForgetPassword(req, res, next) {

    }
}

module.exports = new SiteController();

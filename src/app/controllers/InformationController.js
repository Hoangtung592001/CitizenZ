const UserService = require('../dbserver/UserService');
const CitizenService = require('../dbserver/CitizenService');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

class InformationController {
    home(req, res, next) {
        res.send('Nhập liệu thành công!');
    }
    
    async declaration(req, res, next) {
        const user = req.user.user;
        // return res.json(user);
        await CitizenService.canModify(user.username)
            .then(canModify => {
                if (canModify.error) {
                    return res.json({
                        error: true,
                        msg: canModify.msg
                    });
                }
            })
        if (user.username.length !== 5) {
            return res.json({
                error: true,
                msg: 'Bạn không có quyền truy cập miền này!'
            })
        };
        const citizen = req.body;
        citizen.ward_id = user.username;
        CitizenService.getCitizenById(citizen.citizen_id)
            .then(data => {
                if (data[0]) {
                    return res.status(400).json({
                        error: true,
                        msg: 'Số chứng minh thư đã tồn tại!',
                    });
                }
                CitizenService.addCitizen(citizen)
                    .then(isCreated => {
                        if (!isCreated) {
                            return res.status(400).json({
                                error: true,
                                msg: 'Chưa thêm được thông tin',
                            });
                        }
                        res.status(201).json({
                            error: false,
                            msg: 'Đã thêm được thông tin',
                            citizen
                        });
                    });
            })
    }

    changeInfo(req, res, next) {
        const citizen = req.body;
        CitizenService.changeInfoCitizen(citizen)
            .then(isChanged => {
                if (!isChanged) {
                    return res.status(400).json({
                        error: true,
                        msg: 'Chưa thể thay đổi thông tin'
                    });
                }
                res.status(200).json({
                    error: false,
                    msg: 'Thay đổi thông tin thành công!'
                });
            })
    }
}

module.exports = new InformationController();
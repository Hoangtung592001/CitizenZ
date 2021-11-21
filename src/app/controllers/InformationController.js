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
        await CitizenService.canModify(user.username)
            .then(canModify => {
                if (canModify.error) {
                    return res.json({
                        error: true,
                        msg: canModify.msg
                    });
                }
            })
        await UserService.checkPermission(user.username, 'A4')
            .then(data => {
                if (!data) {
                    return res.json({
                        error: true,
                        msg: 'Người dùng không có quyền modify!'
                    })
                }
            })
            .catch(err => {
                return res.json({
                    error: true,
                    msg: 'Không tìm thấy người dùng!'
                })
            })
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

    async changeInfo(req, res, next) {
        const citizen_id = req.params.citizen_id;
        const user = req.user.user;
        await CitizenService.canModify(user.username)
            .then(async canModify => {
                if (canModify.error) {
                    return res.json({
                        error: true,
                        msg: canModify.msg
                    });
                }
                else {
                    await CitizenService.getCitizenById(citizen_id)
                        .then(async citizen => {
                            if (!citizen[0]) {
                                return res.json({
                                    error: true,
                                    msg: 'Người dùng này không tồn tại!'
                                });
                            }
                            if (user.username !== citizen[0].ward_id) {
                                return res.json({
                                    error: true,
                                    msg: 'Bạn không được quyền sửa đổi người này'
                                })
                            }
                            const updatingCitizen = {
                                ...req.body
                            };
                            
                            await CitizenService.changeInfoCitizen(citizen_id, updatingCitizen)
                                .then(isChanged => {
                                    if (!isChanged) {
                                        return res.status(400).json({
                                            error: true,
                                            msg: 'Chưa thể thay đổi thông tin'
                                        });
                                    }
                                    return res.status(200).json({
                                        error: false,
                                        msg: 'Thay đổi thông tin thành công!'
                                    });
                                })
                        })
                        .catch(err => {
                            return res.json({
                                msg: err.message
                            })
                        })
                }
            })
    }

    async getInfoCitizenOfCities(req, res, next) {
        const user = req.user.user;
        await UserService.checkPermission(user.username, 'A1')
            .then(havePermission => {
                if (!havePermission) {
                    return res.json({
                        error: true,
                        msg: 'Người dùng không có quyền xem!'
                    })
                }
            })
        await CitizenService.getCitizensOfCities()
            .then(cities => {
                res.json(cities);
            })
    }
}

module.exports = new InformationController();
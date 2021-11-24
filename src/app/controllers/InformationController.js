const UserService = require('../dbserver/UserService');
const CitizenService = require('../dbserver/CitizenService');
const FindLocationService = require('../dbserver/FindLocationService') 
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const amqp = require("amqplib");
/*
- Phân tích về tỷ lệ nam, nữ.
- Phân tích về độ tuổi.
- Phân tích về loại dân tộc.
- Tình hình nhập liệu và hoàn thành nhập liệu.

*/
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
        if (!(citizen.citizen_id && citizen.citizen_name && citizen.current_address
            && (citizen.gender === 'Nam' || citizen.gender === 'Nữ') 
        )) {
            return res.json({
                error: true,
                msg: 'Bạn nhập sai hoặc thiếu thông tin!'
            });
        }
        citizen.ward_id = user.username;
        // return res.json(citizen);
        // citizen.ethnic_id = Number(citizen.ethnic_id);
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
                                            msg: 'Bạn nhập chứng minh thư đã bị trùng!'
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

    async deleteCitizen(req, res, next) {
        const user = req.user.user;
        const citizen_id = req.params.citizen_id;
        await CitizenService.getCitizenById(citizen_id)
            .then(async citizen => {
                if (!citizen[0]) {
                    return res.json({
                        error: true,
                        msg: 'Người dùng không tồn tại!'
                    });
                }

                if (citizen[0].ward_id !== user.username) {
                    return res.json({
                        error: true,
                        msg: 'Tài khoản này không có quyền xóa người dùng này!'
                    })
                }
                await CitizenService.deleteCitizen(citizen[0])
                    .then(isDeleted => {
                        if (!isDeleted) {
                            return res.json({
                                error: true,
                                msg: 'Chưa thể xóa cư dân này!'
                            })
                        }
                        return res.json({
                            error: false,
                            msg: 'Đã xóa cư dân này!'
                        });
                    })
            })
    }

    async confirmChangeInfo(req, res, next) {
        const amqpServer = "amqp://localhost:5672";
        const connection = await amqp.connect(amqpServer);
        const channel = await connection.createChannel();
        const QUEUE = `sendConfirm`
        await channel.assertQueue('confirmMessage');
        channel.consume(QUEUE, (data) => {
            channel.sendToQueue('confirmMessage', Buffer.from('OK!'));
            return res.send(JSON.parse(data.content));
        }, {
            noAck: true
        })
    }

    async test(req, res, next) {
        const user = req.user.user;
        UserService.declaringDoneForWard(user.username)
            .then(districts => {
                return res.json(districts);
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
        await FindLocationService.getCitizensOfCities()
            .then(cities => {
                res.json(cities);
            })
    }

    async getInfoCitizenOfDistricts(req, res, next) {
        const user = req.user.user;

        // await UserService.checkPermission(user.username, 'A2')
        //     .then(havePermission => {
        //         if (!havePermission) {
        //             return res.json({
        //                 error: true,
        //                 msg: 'Người dùng không có quyền xem!'
        //             })
        //         }
        //     })
        await FindLocationService.getCitizensOfCities()
            .then(cities => {
                res.json(cities);
            })
    }

    async declaringDone(req, res, next) {
        const user = req.user.user;
        UserService.declaringDoneForWard(user.username)
            .then(isDone => {
                if (!isDone) {
                    return res.json({
                        error: true,
                        msg: 'Có lỗi xảy ra!'
                    })
                }
                return res.json({
                    error: false,
                    msg: 'Khai báo thành công!'
                })
            })
    }
}

module.exports = new InformationController();
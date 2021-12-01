const UserService = require('../dbserver/UserService');
const CitizenService = require('../dbserver/CitizenService');
const FindLocationService = require('../dbserver/FindLocationService') 
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const amqp = require("amqplib");
const moment = require('moment');  

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
        await Promise.all([UserService.checkPermission(user.username, 'B1'), UserService.checkPermission(user.username, 'B2')])
            .then(data => {
                if (!data[1] && !data[0]) {
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
            && (citizen.citizen_gender === 'Nam' || citizen.citizen_gender === 'Nữ') 
        )) {
            return res.json({
                error: true,
                msg: 'Bạn nhập sai hoặc thiếu thông tin!'
            });
        }
        citizen.village_id = user.username;
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

    declarationSite(req, res, next) {
        res.render('information/declaration');
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
                            if (user.username !== citizen[0].village_id) {
                                return res.json({
                                    error: true,
                                    msg: 'Bạn không được quyền sửa đổi người này'
                                })
                            }
                            const updatingCitizen = {
                                ...req.body
                            };
                            delete updatingCitizen.city_id;
                            delete updatingCitizen.district_id;
                            delete updatingCitizen.ward_id;
                            // return res.json(updatingCitizen);
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
                                    // return res.json(isChanged)
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

    changeInfoSite(req, res, next) {
        const citizen_id = req.params.citizen_id;
        const user = req.user.user;
        CitizenService.getCitizenById(citizen_id)
            .then(citizen => {
                const choseCitizen = citizen[0];
                if (choseCitizen.village_id.search(user.username) === -1 && user.role != 'A1') {
                return res.status(404).json({
                    error: true,
                    msg: 'Người dùng không có quyền truy cập miền này!'
                    })
                }
                choseCitizen.date_of_birth = moment(choseCitizen.date_of_birth).format('YYYY-MM-DD');
                // return res.json(citizen);
                res.render('information/changeInfo', { citizen: choseCitizen });
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

                if (citizen[0].village_id !== user.username) {
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
        UserService.changeDatabase()
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
        UserService.declaringDoneForVillage(user.username)
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

    getCountries(req, res, next) {
        FindLocationService.getCountries()
            .then(countries => {
                return res.json(countries);
            })
    }

    getEthnicGroups(req, res, next) {
        FindLocationService.getEthnicGroups()
            .then(groups => {
                return res.json(groups);
            })
    }
}

module.exports = new InformationController();
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
    // Hàm dùng để khai báo công dân của B2
    async declaration(req, res, next) {
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
                    await Promise.all([UserService.checkPermission(user.username, 'B2')])
                        .then(async data => {
                            if (!data[0]) {
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
                    if (!(citizen.citizen_id && citizen.citizen_name
                        && (citizen.citizen_gender === 'Nam' || citizen.citizen_gender === 'Nữ')
                        && citizen.occupation && citizen.educational_level && citizen.permanent_address && citizen.temporary_address && citizen.hometown
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
            })
    }

    async declarationByB1(req, res, next) {
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
                    await Promise.all([UserService.checkPermission(user.username, 'B1')])
                        .then(async data => {
                            if (!data[0]) {
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
                    if (!(citizen.citizen_id && citizen.citizen_name
                        && (citizen.citizen_gender === 'Nam' || citizen.citizen_gender === 'Nữ')
                        && citizen.occupation && citizen.educational_level && citizen.permanent_address && citizen.temporary_address && citizen.hometown && citizen.village_id
                    )) {
                        return res.json({
                            error: true,
                            msg: 'Bạn nhập sai hoặc thiếu thông tin!'
                        });
                    }
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
            })
    }

    // Hàm để render ra form khai báo công dân.
    declarationSite(req, res, next) {
        res.render('information/declarationByB2');
    }

    declarationByB1Site(req, res, next) {
        res.render('information/declarationByB1');
    }

    // Hàm dùng để sửa thông tin công dân.
    async changeInfoByB2(req, res, next) {
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
                                    msg: 'Bạn không có quyền thay đổi người này!'
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

    async changeInfoByB1(req, res, next) {
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
                            if (citizen[0].village_id.indexOf(user.username) !== 0 || user.username.length !== 6) {
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
    // Hàm render ra trang sửa thông tin công dân.

    changeInfoByB1Site(req, res, next) {
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
                res.render('information/modifyProfileByB1', { citizen: choseCitizen });
            })
    }

    changeInfoByB2Site(req, res, next) {
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
                res.render('information/modifyProfileByB2', { citizen: choseCitizen });
            })
    }
    
    // Hàm dùng để xóa một công dân.

    async deleteCitizen(req, res, next) {
        const user = req.user.user;
        // id của công dân muốn xóa
        const citizen_id = req.params.citizen_id;
        // Lấy công dân xem công dân có tồn tại không nếu không tồn tại thì không xóa được.
        await CitizenService.getCitizenById(citizen_id)
            .then(async citizen => {
                if (!citizen[0]) {
                    return res.json({
                        error: true,
                        msg: 'Người dùng không tồn tại!'
                    });
                }
                // Check xem người này có quyền xóa công dân này không.
                if ( 
                    citizen[0].village_id !== user.username
                    && (citizen[0].village_id.substring(0, 6) !== user.username)
                ) {
                    return res.json({
                        error: true,
                        msg: 'Tài khoản này không có quyền xóa người dùng này!'
                    })
                }
                // Gọi hàm xóa coogn dân ở CitizenService
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

    // Đây là hàm mà ví dụ một người muốn chuyển từ làng 1  qua làng 2 khác thì làng 1 sẽ gửi 
    // request cho làng 2 nếu làng 2 chấp nhận thì công dân sẽ được chuyển làng.

    // async confirmChangeInfo(req, res, next) {
    //     const user = req.user.user;
    //     const amqpServer = "amqp://localhost:5672";
    //     const connection = await amqp.connect(amqpServer);
    //     const channel = await connection.createChannel();
    //     const QUEUE = `sendConfirm`
    //     await channel.assertQueue('confirmMessage');
    //     channel.consume(QUEUE, (data) => {
    //         channel.sendToQueue('confirmMessage', Buffer.from('OK!'));
    //         return res.send(JSON.parse(data.content));
    //     }, {
    //         noAck: true
    //     })
    // }

    async test(req, res, next) {

        var beginningTime = moment('2021-12-30 15:12:26');
        var endTime = moment('2021-12-30 15:12:26');
        return res.json(beginningTime.isBefore(endTime));
    }

    // Đây là hàm dùng để lấy Infomation của công dân của một thành phố

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

    // Đây là hàm xác nhận người dùng đã khai báo xong

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

    // Đây là hàm dùng để lấy Tất cả các quốc gia trên thế giới và render vào trong 
    // ô select ở trong phần form khai báo công dân

    getCountries(req, res, next) {
        FindLocationService.getCountries()
            .then(countries => {
                return res.json(countries);
            })
    }

    // Hàm lấy tất cả các dân tộc và render vào trong form khai báo công dân.

    getEthnicGroups(req, res, next) {
        FindLocationService.getEthnicGroups()
            .then(groups => {
                return res.json(groups);
            })
    }
}

module.exports = new InformationController();
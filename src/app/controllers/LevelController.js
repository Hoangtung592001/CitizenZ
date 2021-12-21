const UserService = require('../dbserver/UserService');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const Validate = require('../service/validate');
const FindLocationService = require('../dbserver/FindLocationService');
const EncryptService = require('../service/encryptService');
class LevelController {
    async home(req, res, next) {
        res.send('Phân quyền thành công!');
    }

    // Hàm này là A1 phân quyền cho A2

    async decentralizeForCities(req, res, next) {
        const user = req.user.user;
        const password = req.body.password;
        if (user.role !== 'A1') {
            return res.status(400).json({
                error: true,
                msg: 'Bạn không có quyền làm việc này!'
            })
        };
        FindLocationService.getAllCities()
            .then(cities => {
                UserService.getUserByUsername(cities[0].city_id)
                    .then(user => {
                        if (user[0]) {
                            return res.json({
                                error: true,
                                msg: 'Cấp trên đã cấp tài khoản cho các tỉnh, thành phố này!'
                            })
                        }
                        cities.forEach((city) => {
                            const user = {};
                            const role = 'A2';
                            user.username = city.city_id;
                            user.password = password;
                            user.role = role;
                            UserService.addUser(user)
                        })
                        return res.status(200).json({
                            error: false,
                            msg: 'Đăng ký thành công!',
                        });
                    })
                    .catch(err => {
                        return res.json({
                            error: true,
                            msg: 'Có lỗi xảy ra'
                        })
                    })
            })
            .catch(err => {
                return res.json({
                    error: true,
                    msg: 'Không tìm được thông tin các tỉnh, thành phố'
                })
            })
    }

    // Hàm này là A2 phân quyền cho A3

    async decentralizeForDistricts(req, res, next) {
        const user = req.user.user;
        const password = req.body.password;
        if (user.role !== 'A2') {
            return res.status(400).json({
                error: true,
                msg: 'Bạn không có quyền làm việc này!'
            })
        };
        FindLocationService.getAllDistricts(user.username)
            .then(districts => {
                UserService.getUserByUsername(districts[0].district_id)
                    .then(user => {
                        if (user[0]) {
                            return res.json({
                                error: true,
                                msg: 'Cấp trên đã cấp tài khoản cho các quận, huyện này!'
                            })
                        }
                        districts.forEach((district) => {
                            const user = {};
                            const role = 'A3';
                            user.username = district.district_id;
                            user.password = password;
                            user.role = role;
                            UserService.addUser(user)
                        })
                        res.status(200).json({
                            error: false,
                            msg: 'Đăng ký thành công!',
                        });
                    })
                    .catch(err => {
                        return res.json({
                            error: true,
                            msg: 'Không tìm được thông tin các quận, huyện'
                        })
                    })
                    
            })
            .catch(err => {
                return res.json({
                    error: true,
                    msg: 'Không tìm được thông tin các quận, huyện'
                })
            })
    }

    // Hàm này là A3 phân quyền cho B1

    async decentralizeForWards(req, res, next) {
        const user = req.user.user;
        const password = req.body.password;
        if (user.role !== 'A3') {
            return res.status(400).json({
                error: true,
                msg: 'Bạn không có quyền làm việc này!'
            })
        };
        FindLocationService.getAllWards(user.username)
            .then(wards => {
                UserService.getUserByUsername(wards[0].ward_id)
                    .then(user => {
                        console.log('not err');
                        if (user[0]) {
                            return res.json({
                                error: true,
                                msg: 'Cấp trên đã cấp tài khoản cho các xã, phường này!'
                            })
                        }
                        wards.forEach((ward) => {
                            const user = {};
                            const role = 'B1';
                            user.username = ward.ward_id;
                            user.password = password;
                            user.role = role;
                            UserService.addUser(user)
                        })
                        res.status(200).json({
                            error: false,
                            msg: 'Đăng ký thành công!',
                        });
                    })
                    .catch(err => {
                        return res.json({
                            error: true,
                            msg: 'Không tìm được thông tin các xã, phường'
                        })
                    })
                    
            })
            .catch(err => {
                return res.json({
                    error: true,
                    msg: 'Không tìm được thông tin các xã, phường'
                })
            })
    }

    // Hàm này là B1 phân quyền cho B2

    async decentralizeForVillages(req, res, next) {
        const user = req.user.user;
        const password = req.body.password;
        if (user.role !== 'B1') {
            return res.status(400).json({
                error: true,
                msg: 'Bạn không có quyền làm việc này!'
            })
        };
        FindLocationService.getAllVillages(user.username)
            .then(villages => {
                UserService.getUserByUsername(villages[0].village_id)
                    .then(user => {
                        if (user[0]) {
                            return res.json({
                                error: true,
                                msg: 'Cấp trên đã cấp tài khoản cho các làng, thôn, bản này!'
                            })
                        }
                        villages.forEach((village) => {
                            const user = {};
                            const role = 'B2';
                            user.username = village.village_id;
                            user.password = password;
                            user.role = role;
                            UserService.addUser(user)
                        })
                        res.status(200).json({
                            error: false,
                            msg: 'Đăng ký thành công!',
                        });
                    })
                    .catch(err => {
                        return res.json({
                            error: true,
                            msg: 'Không tìm được thông tin các làng, thôn, bản'
                        })
                    })
            })
            .catch(err => {
                return res.json({
                    error: true,
                    msg: 'Không tìm được thông tin các làng, thôn, bản'
                })
            })
    }

    async grantPrivilegesForCities(req, res, next) {

    }

    async grantPrivilegesForDistricts(req, res, next) {

    }

    async grantPrivilegesForWards(req, res, next) {
        
    }

    async grantPrivilegesForVillages(req, res, next) {
        
    }

    async grantCode(req, res, next) {
        const username = req.user.user.username;
        const arrayOfId = req.body;
        const isValid = arrayOfId.every(id => {
            return id.length === username.length + 2 && id.indexOf(username) === 0;
        });
        if (!isValid) {
            return res.status(403).json({
                error: true,
                msg: 'Nhập dữ liệu không hợp lệ!'
            });
        }
        await UserService.findGrantedCode(arrayOfId[0])
            .then(async id => {
                if (id[0]) {
                    return res.json({
                        error: true,
                        msg: 'Bạn đã cấp id cho cấp này!'
                    })
                }
                else {
                    arrayOfId.forEach(id => {
                        UserService.grantCode(id);
                    });
                    return res.status(200).json({
                        error: false,
                        msg: 'Cấp mã thành công!'
                    });
                }
            })
    }
}

module.exports = new LevelController();

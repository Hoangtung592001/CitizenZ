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

    async decentralizeForCities(req, res, next) {
        const user = req.user.user;
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
                                msg: 'Cấp trên đã cấp tài khoản cho các quận, huyện này!'
                            })
                        }
                        cities.forEach((city) => {
                            const user = {};
                            const role = 'A2';
                            user.username = city.city_id;
                            user.password = '123456789';
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
                    msg: 'Không tìm được thông tin các quận, huyện'
                })
            })
    }

    async decentralizeForDistricts(req, res, next) {
        const user = req.user.user;
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
                            user.password = '123456789';
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

    async decentralizeForWards(req, res, next) {
        const user = req.user.user;
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
                                msg: 'Cấp trên đã cấp tài khoản cho các quận, huyện này!'
                            })
                        }
                        wards.forEach((ward) => {
                            const user = {};
                            const role = 'B1';
                            user.username = ward.ward_id;
                            user.password = '123456789';
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

    async decentralizeForVillages(req, res, next) {
        const user = req.user.user;
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
                        console.log('not err');
                        if (user[0]) {
                            return res.json({
                                error: true,
                                msg: 'Cấp trên đã cấp tài khoản cho các quận, huyện này!'
                            })
                        }
                        villages.forEach((village) => {
                            const user = {};
                            const role = 'B2';
                            user.username = village.village_id;
                            user.password = '123456789';
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
}

module.exports = new LevelController();

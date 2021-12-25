const UserService = require('../dbserver/UserService');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const Validate = require('../service/validate');
const FindLocationService = require('../dbserver/FindLocationService');
const EncryptService = require('../service/encryptService');
const moment = require('moment');
class LevelController {
    async home(req, res, next) {
        
    }

    /*
        const username = req.user.user.username;
        { startTime, expiryTime };
        const { id, gratedStartTime, gratedExpiryTime } = req.body;

    */

    // Hàm này là A1 phân quyền cho A2

    async grantUser(req, res, next) {
        const userLoggedIn = req.user.user;
        const { username, password } = req.body;
        if (username.length === 2) {
            if (userLoggedIn.role !== 'A1') {
                return res.json({
                    error: true,
                    msg: 'Bạn không có quyền cấp tài khoản này!'
                })
            }
        }
        else {
            if (
                    username.length - 2 !== userLoggedIn.username.length
                    || username.indexOf(userLoggedIn.username) !== 0
                ) {
                return res.json({
                    error: true,
                    msg: 'Bạn không có quyền cấp tài khoản này!'
                })
            }
        }
        const user = {};
        user.username = username;
        user.password = await EncryptService.encryptSingle(password);
        user.role = username.length === 2 ? 'A2' : (username.length === 4 ? 'A3' : (username.length === 6 ? 'B1' : 'B2'));
        await UserService.getUserByUsername(user.username)
            .then(async userInDb => {
                if (userInDb[0]) {
                    await UserService.setPassword(user.username, user.password);
                    return res.json({
                        msg: 'Cập nhật mật khẩu thành công!'
                    })
                }
                else {
                    await UserService.addUser(user);
                    return res.json({
                        msg: 'Cấp tài khoản thành công!'
                    })
                }
            })
        // return res.json({
        //     error: false,
        //     msg: 'Cấp tài khoản thành công!'
        // });
        // FindLocationService.getAllCities()
        //     .then(cities => {
        //         UserService.getUserByUsername(cities[0].city_id)
        //             .then(user => {
        //                 if (user[0]) {
        //                     return res.json({
        //                         error: true,
        //                         msg: 'Cấp trên đã cấp tài khoản cho các tỉnh, thành phố này!'
        //                     })
        //                 }
        //                 cities.forEach((city) => {
        //                     const user = {};
        //                     const role = 'A2';
        //                     user.username = city.city_id;
        //                     user.password = password;
        //                     user.role = role;
        //                     UserService.addUser(user)
        //                 })
        //                 return res.status(200).json({
        //                     error: false,
        //                     msg: 'Đăng ký thành công!',
        //                 });
        //             })
        //             .catch(err => {
        //                 return res.json({
        //                     error: true,
        //                     msg: 'Có lỗi xảy ra'
        //                 })
        //             })
        //     })
        //     .catch(err => {
        //         return res.json({
        //             error: true,
        //             msg: 'Không tìm được thông tin các tỉnh, thành phố'
        //         })
        //     })
    }

    // async decentralizeForCities(req, res, next) {
    //     const user = req.user.user;
    //     const password = req.body.password;
    //     if (user.role !== 'A1') {
    //         return res.status(400).json({
    //             error: true,
    //             msg: 'Bạn không có quyền làm việc này!'
    //         })
    //     };
    //     FindLocationService.getAllCities()
    //         .then(cities => {
    //             UserService.getUserByUsername(cities[0].city_id)
    //                 .then(user => {
    //                     if (user[0]) {
    //                         return res.json({
    //                             error: true,
    //                             msg: 'Cấp trên đã cấp tài khoản cho các tỉnh, thành phố này!'
    //                         })
    //                     }
    //                     cities.forEach((city) => {
    //                         const user = {};
    //                         const role = 'A2';
    //                         user.username = city.city_id;
    //                         user.password = password;
    //                         user.role = role;
    //                         UserService.addUser(user)
    //                     })
    //                     return res.status(200).json({
    //                         error: false,
    //                         msg: 'Đăng ký thành công!',
    //                     });
    //                 })
    //                 .catch(err => {
    //                     return res.json({
    //                         error: true,
    //                         msg: 'Có lỗi xảy ra'
    //                     })
    //                 })
    //         })
    //         .catch(err => {
    //             return res.json({
    //                 error: true,
    //                 msg: 'Không tìm được thông tin các tỉnh, thành phố'
    //             })
    //         })
    // }

    // Hàm này là A2 phân quyền cho A3

    // async decentralizeForDistricts(req, res, next) {
    //     const user = req.user.user;
    //     const password = req.body.password;
    //     if (user.role !== 'A2') {
    //         return res.status(400).json({
    //             error: true,
    //             msg: 'Bạn không có quyền làm việc này!'
    //         })
    //     };
    //     FindLocationService.getAllDistricts(user.username)
    //         .then(districts => {
    //             UserService.getUserByUsername(districts[0].district_id)
    //                 .then(user => {
    //                     if (user[0]) {
    //                         return res.json({
    //                             error: true,
    //                             msg: 'Cấp trên đã cấp tài khoản cho các quận, huyện này!'
    //                         })
    //                     }
    //                     districts.forEach((district) => {
    //                         const user = {};
    //                         const role = 'A3';
    //                         user.username = district.district_id;
    //                         user.password = password;
    //                         user.role = role;
    //                         UserService.addUser(user)
    //                     })
    //                     res.status(200).json({
    //                         error: false,
    //                         msg: 'Đăng ký thành công!',
    //                     });
    //                 })
    //                 .catch(err => {
    //                     return res.json({
    //                         error: true,
    //                         msg: 'Không tìm được thông tin các quận, huyện'
    //                     })
    //                 })
                    
    //         })
    //         .catch(err => {
    //             return res.json({
    //                 error: true,
    //                 msg: 'Không tìm được thông tin các quận, huyện'
    //             })
    //         })
    // }

    // // Hàm này là A3 phân quyền cho B1

    // async decentralizeForWards(req, res, next) {
    //     const user = req.user.user;
    //     const password = req.body.password;
    //     if (user.role !== 'A3') {
    //         return res.status(400).json({
    //             error: true,
    //             msg: 'Bạn không có quyền làm việc này!'
    //         })
    //     };
    //     FindLocationService.getAllWards(user.username)
    //         .then(wards => {
    //             UserService.getUserByUsername(wards[0].ward_id)
    //                 .then(user => {
    //                     console.log('not err');
    //                     if (user[0]) {
    //                         return res.json({
    //                             error: true,
    //                             msg: 'Cấp trên đã cấp tài khoản cho các xã, phường này!'
    //                         })
    //                     }
    //                     wards.forEach((ward) => {
    //                         const user = {};
    //                         const role = 'B1';
    //                         user.username = ward.ward_id;
    //                         user.password = password;
    //                         user.role = role;
    //                         UserService.addUser(user)
    //                     })
    //                     res.status(200).json({
    //                         error: false,
    //                         msg: 'Đăng ký thành công!',
    //                     });
    //                 })
    //                 .catch(err => {
    //                     return res.json({
    //                         error: true,
    //                         msg: 'Không tìm được thông tin các xã, phường'
    //                     })
    //                 })
                    
    //         })
    //         .catch(err => {
    //             return res.json({
    //                 error: true,
    //                 msg: 'Không tìm được thông tin các xã, phường'
    //             })
    //         })
    // }

    // // Hàm này là B1 phân quyền cho B2

    // async decentralizeForVillages(req, res, next) {
    //     const user = req.user.user;
    //     const password = req.body.password;
    //     if (user.role !== 'B1') {
    //         return res.status(400).json({
    //             error: true,
    //             msg: 'Bạn không có quyền làm việc này!'
    //         })
    //     };
    //     FindLocationService.getAllVillages(user.username)
    //         .then(villages => {
    //             UserService.getUserByUsername(villages[0].village_id)
    //                 .then(user => {
    //                     if (user[0]) {
    //                         return res.json({
    //                             error: true,
    //                             msg: 'Cấp trên đã cấp tài khoản cho các làng, thôn, bản này!'
    //                         })
    //                     }
    //                     villages.forEach((village) => {
    //                         const user = {};
    //                         const role = 'B2';
    //                         user.username = village.village_id;
    //                         user.password = password;
    //                         user.role = role;
    //                         UserService.addUser(user)
    //                     })
    //                     res.status(200).json({
    //                         error: false,
    //                         msg: 'Đăng ký thành công!',
    //                     });
    //                 })
    //                 .catch(err => {
    //                     return res.json({
    //                         error: true,
    //                         msg: 'Không tìm được thông tin các làng, thôn, bản'
    //                     })
    //                 })
    //         })
    //         .catch(err => {
    //             return res.json({
    //                 error: true,
    //                 msg: 'Không tìm được thông tin các làng, thôn, bản'
    //             })
    //         })
    // }

    // Phân quyền từ admin về các thành phố.
    async grantPrivilegesForCities(req, res, next) {
        const role = req.user.user.role;
        if (role !== 'A1') {
            return res.json({
                error: true,
                msg: 'Phân quyền thất bại vì bạn không có quyền này!'
            })
        }
        const { startTime, expiryTime, unitId } = req.body;
        if (moment(startTime).isAfter(moment(expiryTime))) {
            return res.json({
                error: true,
                msg: 'Bạn nhập thời gian sai!'
            });
        }
        // await FindLocationService.getAllCities()
        //     .then(cities => {
        //         cities.forEach(async city => {
        //             await UserService.grantPrivileges(unitId, startTime, expiryTime);
        //         });
        //     });
        await UserService.grantPrivileges(unitId, startTime, expiryTime);
        return res.json({ 
            error: false,
            msg: 'Phân quyền khai báo thành công!'
        });
    }
    // Phân quyền cho các huyện, xã, làng
    async grantPrivilegesForBelowLevel(req, res, next) {
        const username = req.user.user.username;
        // Nếu ở cấp làng thì không phân quyền được
        if (username.length === 8) {
            return res.json({ 
                error: true,
                msg: 'Bạn không có cấp dưới để phân'
            });
        }

        const { startTime, expiryTime, unitId } = req.body;
        if (moment(startTime).isAfter(moment(expiryTime))) {
            return res.json({
                error: true,
                msg: 'Bạn nhập thời gian sai!'
            });
        }
        await UserService.getUserByUsername(username)
            .then(async foundUser => {
                foundUser = foundUser[0];
                if (foundUser.declaringDone) {
                    return res.json({
                        error: true,
                        msg: 'Bạn chưa được quyền cấp thời gian khai báo!'
                    })
                }
                if (
                    moment(foundUser.startTime).isAfter(moment(startTime))
                    || moment(foundUser.expiryTime).isBefore(moment(expiryTime)
                )) {
                    return res.json({
                        error: true,
                        msg: 'Vui lòng nhập thời gian đúng quy định!'
                    })
                }
                
                else {
                    // await UserService.getUserNodeChild(username)
                    //     .then(async userChildren => {
                    //         await Promise.all(userChildren.map(async (userChild) => {
                    //             await UserService.grantPrivileges(userChild.username, startTime, expiryTime);
                    //         }));
                    //     })
                    await UserService.grantPrivileges(unitId, startTime, expiryTime);
                    return res.json({ 
                        error: false,
                        msg: 'Phân quyền khai báo thành công!'
                    });
                }
            })
        // await UserService.grantPrivileges(id, startTime, expiryTime);
    }
    // Hàm xử lý cấp mã cho các con

    async grantCode(req, res, next) {
        const { username, role } = req.user.user;
        const { name, unitId } = req.body;
        let isValid;
        // Nếu mà người dùng là A1 thì phân quyền cho các cities
        if (role === 'A1') {
            isValid = unitId.length === 2;
        }
        // Người dùng là cấp tỉnh, huyện, xã.
        else {
            isValid = username.length + 2 === unitId.length && unitId.indexOf(username) === 0 && unitId.length <= 8;
        }
        
        // Check xem có cấp mã đúng hay không!
        if (!isValid) {
            return res.status(403).json({
                error: true,
                msg: 'Nhập dữ liệu không hợp lệ!'
            });
        }
        await UserService.findGrantedCode(unitId)
            .then(async id => {
                if (id[0]) {
                    return res.json({
                        error: true,
                        msg: 'Bạn đã cấp id cho đơn vị này!'
                    })
                }
                else {
                    // arrayOfId.forEach(id => {
                    //     UserService.grantCode(id);
                    // });
                    UserService.grantCode(unitId, name, username);
                    return res.status(200).json({
                        error: false,
                        msg: 'Cấp mã thành công!'
                    });
                }
            })
    }
}

module.exports = new LevelController();

const UserService = require('../dbserver/UserService');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const Validate = require('../service/validate');
const CityService = require('../dbserver/CityService');
class LevelController {
    async home(req, res, next) {
        res.send('Phân quyền thành công!');
    }




    async decentralizeForCities(req, res, next) {
        const role = req.user.user.role;
        if (role !== 'A1') {
            return res.status(400).json({
                error: true,
                msg: 'Bạn không có quyền làm việc này!'
            });
        }
        CityService.getAllCities()
            .then(async cities => {
                if (!cities[0]) {
                    return res.json({
                        error: true,
                        msg: 'No cities found'
                    })
                }
                let a = 0;
                await cities.forEach((city) => {
                    a++;
                    const user = {};
                    const role = 'A2';
                    user.username = city.city_id;
                    user.password = '123456789';
                    user.role = role;
                    UserService.addUser(user)
                    .then(isCreated => {
                        if (!isCreated) {
                            res.status(400).json({
                                error: true,
                                msg: 'Chưa đăng kí được tài khoản',
                            });
                        }
                    })
                })
                res.status(200).json({
                    a: a,
                    error: false,
                    msg: 'Cấp quyền cho các tỉnh thành công!'
                });
            });
                
                
    }
}

module.exports = new LevelController();

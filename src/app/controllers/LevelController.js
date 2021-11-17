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

                UserService.getUserByUsername(cities[0].city_id)
                    .then(async hasUser => {
                        if (hasUser[0]) {
                            return res.status(400).json({
                                error: true,
                                msg: 'Chưa đăng kí được tài khoản',
                            });
                        }
                        await cities.forEach((city) => {
                            const user = {};
                            const role = 'A2';
                            user.username = city.city_id;
                            user.password = '123456789';
                            user.role = role;
                            UserService.addUser(user)
                        })
                        res.status(400).json({
                            error: false,
                            msg: 'Đăng ký thành công!',
                        });
                    })
            });
                
                
    }
}

module.exports = new LevelController();

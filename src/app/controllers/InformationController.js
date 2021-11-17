const UserService = require('../dbserver/UserService');
const CitizenService = require('../dbserver/CitizenService');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

class InformationController {
    /*
        Số chứng minh nhân dân
        Họ và tên
        Năm sinh:
        Giới tính
        Nguyên Quán:
            Tỉnh: city_id
            Quận, Huyện: district_id
            Xã, Phường: Ghi chi tiết
        
    */
    home(req, res, next) {
        res.send('Nhập liệu thành công!');
    }

    declaration(req, res, next) {
        const citizen = req.body;
        delete citizen.province_id, citizen.district_id;
        CitizenService.getCitizenById(citizen.citizen_id)
            .then(data => {
                if (data[0]) {
                    return res.status(400).json({
                        error: true,
                        msg: 'Số chứng minh thư đã tồn tại!',
                    });
                }
                UserService.addCitizen(citizen)
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

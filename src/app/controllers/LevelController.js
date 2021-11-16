const UserService = require('../dbserver/UserService');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const Validate = require('../service/validate');
class LevelController {
    home(req, res, next) {
        res.send('Phân quyền thành công!');
    }
}

module.exports = new LevelController();

const UserService = require('../dbserver/UserService');
const CitizenService = require('../dbserver/CitizenService');
const FindLocationService = require('../dbserver/FindLocationService') 
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const amqp = require("amqplib");
const moment = require('moment');  

class InfoLevelController {
    getInfoLevels(req, res, next) {
        const id = req.params.id;
        FindLocationService.getInfoOfLevelsNoUser(id)
            .then(data => {
                return res.json(data);
            })
    }
}

module.exports = new InfoLevelController();
const UserService = require('../dbserver/UserService');
const CitizenService = require('../dbserver/CitizenService');
const FindLocationService = require('../dbserver/FindLocationService') 
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const amqp = require("amqplib");
const moment = require('moment');  

class GetInfoController {
    // Hàm phục vụ cho ô tìm kiếm tìm kiếm người dân theo tên.
    async getInfoBySearch(req, res, next) {
        const searchValue = req.params.searchValue;
        const { username, role}  = req.user.user;
        CitizenService.getCitizensBySearchValue(searchValue)
            .then(citizens => {
                citizens = citizens.map(citizen => {
                    citizen.date_of_birth = moment(citizen.date_of_birth).format('YYYY-MM-DD');
                    return citizen;
                })
                if (role !== 'A1') {
                    citizens = citizens.filter(citizen => citizen.village_id.indexOf(username) === 0)
                }
                return res.render('information/searchCitizens', { citizens: citizens });
                // return res.json(accessedCitizens);
            })
            .catch(err => {
                return res.status(403).send(err);
            })
    }

    // Hàm phân tích dân số: Xem Nam bao nhiêu nữ bao nhiêu, ...
    async analysePopulation(req, res, next) {
        const id = req.body.id;
        CitizenService.getCitizensOfLevels(id)
            .then(citizens => {
                const totalPopulation = citizens.length;
                const lower18YearsOld = citizens.filter(citizen => {
                    return moment().diff(citizen.date_of_birth, 'years',true) < 18 
                }).length;
                const upper18YearsOldLower65 = citizens.filter(citizen => {
                    const age = moment().diff(citizen.date_of_birth, 'years',true);
                    return age >= 18 && age < 65;
                }).length;
                const upper65YearsOld = citizens.filter(citizen => {
                    const age = moment().diff(citizen.date_of_birth, 'years',true)
                    return age >= 65;
                }).length;
                const numberOfMale = citizens.filter(citizen => {
                    return citizen.citizen_gender === 'Nam';
                }).length;
                const numberOfFemale = citizens.filter(citizen => {
                    return citizen.citizen_gender === 'Nữ';
                }).length;
                const population = citizens.length;
                return res.json({
                    lower18YearsOld: lower18YearsOld,
                    upper18YearsOldLower65: upper18YearsOldLower65,
                    upper65YearsOld: upper65YearsOld,
                    numberOfMale: numberOfMale,
                    numberOfFemale: numberOfFemale,
                    totalPopulation: totalPopulation
                });
            })
            .catch(err => {
                return res.json(err);
            })
    }

    async getUserInfo(req, res, next) {
        UserService.getUserByUsername(req.user.user.username)
            .then(user => {
                delete user[0].password;
                delete user[0].canModify;
                // 2021-12-16 20:12:24
                user[0].startTime = moment(user[0].startTime).format('YYYY-MM-DD HH:mm:ss')
                user[0].expiryTime = moment(user[0].expiryTime).format('YYYY-MM-DD HH:mm:ss')
                return res.json(user[0])
            })
    }

    async getChildUser(req, res, next) {
        UserService.getUserNodeChild()
    }

    async gratedUser(req, res, next) {
        const user = req.user.user;
        let id;
        if (user.role === 'A1') {
            id = 'city';
        }
        else {
            id = user.username;
        }
        UserService.grantedUser(id)
            .then(data => {
                return res.json(data);
            })
    }
    async grantedTimeUser(req, res, next) {
        const user = req.user.user;
        let id;
        if (user.role === 'A1') {
            id = 'city';
        }
        else {
            id = user.username;
        }
        UserService.grantedUser(id)
            .then(users => {
                users = users.filter(user => user.startTime && user.expiryTime);
                users = users.map(user => {
                    user.startTime = moment(user.startTime).format('YYYY-MM-DD HH:mm:ss')
                    user.expiryTime = moment(user.expiryTime).format('YYYY-MM-DD HH:mm:ss')
                    return user;
                })
                return res.json(users);
                //users.filter(user => !user.startTime && !user.expiryTime)
            })
    }

}

module.exports = new GetInfoController();
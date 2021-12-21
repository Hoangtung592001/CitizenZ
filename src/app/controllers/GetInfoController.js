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
        const username = req.user.user.username;
        CitizenService.getCitizensBySearchValue(searchValue)
            .then(citizens => {
                const accessedCitizens = citizens.filter(citizen => citizen.village_id.indexOf(username) === 0)
                return res.json(accessedCitizens);
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
                const lower18YearsOld = citizens.filter(citizen => {
                    return moment().diff(citizen.date_of_birth, 'years',true) < 18 
                }).length;
                const upper18YearsOldLower65 = citizens.filter(citizen => {
                    const age = moment().diff(citizen.date_of_birth, 'years',true);
                    console.log(age);
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
                    numberOfFemale: numberOfFemale
                });
            })
            .catch(err => {
                return res.json(err);
            })
    }
}

module.exports = new GetInfoController();
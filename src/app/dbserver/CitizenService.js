const db = require('./models/Citizen_Model');
const UserService = require('./UserService');
const FindLocationService = require('./FindLocationService');

db.connect();

class CitizenService {

    async addCitizen(citizen) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO citizens SET ? ';
                db.query(query, [citizen], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                });
            });
            return response;
        }
        catch(err) {
            console.log(err);
        }
    }   

    async getCitizenById(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM citizens WHERE citizen_id = ?';
                db.query(query, [id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            });
            return response;
        }
        catch(err) {
            console.log(err);
        }
    }

    async changeInfoCitizen(citizen_id, citizen) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `UPDATE citizens` + 
                ` SET ? WHERE citizen_id = "${citizen_id}"`;
                db.query(query, [citizen], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            return response;
        }
        catch(err) {
            console.log(err);
        }
    }

    async canModify(username) {
        try {
            const response = await new Promise((resolve, reject) => {
                UserService.getUserByUsername(username)
                    .then(data => {
                        const checkingUser = data[0];
                        if (!checkingUser) {
                            resolve({
                                error: true,
                                msg: 'Lỗi không tìm thấy người dùng!'
                            });
                        }
                        if (!checkingUser.canModify) {
                            resolve({
                                error: true,
                                msg: 'Tài khoản này bị khóa tất cả các quyền!'
                            });
                        }
                        else {
                            resolve({
                                error: false,
                                msg: 'Có quyền truy cập!'
                            })
                        }
                    })
            });
            return response;
        }
        catch(err) {
            console.log(err);
        }
    }
    
    async getCitizensOfCities() {
        try {
            const response = await new Promise((resolve, reject) => {
                FindLocationService.getAllCities()
                    .then(cities => {
                        resolve(cities);
                    })
            });
            return response;
        }
        catch(err) {
            console.log(err);
        }
    }
}

module.exports = new CitizenService();
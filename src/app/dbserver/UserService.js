const db = require('./models/model');
const EncryptService = require('../service/encryptService');
const bcrypt = require('bcrypt');
const FindLocationService = require('./FindLocationService');
db.connect();

class UserService {
    async addUser(user) {
        try {
            const salt = await bcrypt.genSalt(10);
            user.password = await EncryptService.encryptSingle(user.password);
            const response = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO users SET ? ';
                db.query(query, [user], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            })
            return response === 1 ? true : false;
        }
        catch(err) {
            console.log(error);
        }
    }

    async addUsers(users) {
        try {
            const response = await new Promise(async (resolve, reject) => {
                const newUsers = await users.map(async user => {
                    const password = await EncryptService.encryptSingle(user[1]);
                    return [user[0], password, user[2]];
                })
                const query = 'INSERT INTO users VALUES ? ';
                db.query(query, [newUsers], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            })
            return response;
        }
        catch(err) {
            console.log(error);
        }
    }

    async getUserByUsername(username) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM users WHERE username = ?';
                db.query(query, [username], (err, result) => {
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

    async setPassword(username, newPassword) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `UPDATE users` + 
                ` SET password = ? WHERE username = "${username}"`;
                db.query(query, [newPassword], (err, result) => {
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

    async checkPermission(username, role) {
        try {
            const response = await new Promise((resolve, reject) => {
                this.getUserByUsername(username)
                    .then(user => {
                        if (!user[0]) {
                            reject(new Error('Lỗi không tìm thấy người dùng!'));
                        }
                        resolve(user[0].role === role);
                    })
            });
            return response;
        }
        catch(err) {
            console.log(err);
        }
    }

    async lockDeclaringWard(username) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'UPDATE users SET canModify = 0 WHERE username = ?'
                db.query(query, [username], (err, result) => {
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

    async unlockDeclaringWard(username) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'UPDATE users SET canModify = 1 WHERE username = ?'
                db.query(query, [username], (err, result) => {
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


    async lockDeclaringDistrict(username) {
        try {
            const response = await new Promise(async (resolve, reject) => {
                await FindLocationService.getAllWards(username)
                    .then(wards => {
                        wards.forEach(ward => {
                            this.lockDeclaringWard(ward.ward_id);
                        });
                    })
                resolve(true);
            });
            return response;
        }
        catch(err) {
            console.log(err);
        }
    }

    async unlockDeclaringDistrict(username) {
        try {
            const response = await new Promise(async (resolve, reject) => {
                await FindLocationService.getAllWards(username)
                    .then(wards => {
                        wards.forEach(ward => {
                            this.unlockDeclaringWard(ward.ward_id);
                        });
                    })
                resolve(true);
            });
            return response;
        }
        catch(err) {
            console.log(err);
        }
    }

    async lockDeclaringCity(username) {
        try {
            const response = await new Promise(async (resolve, reject) => {
                await FindLocationService.getAllDistricts(username)
                    .then(districts => {
                        districts.forEach(district => {
                            this.lockDeclaringDistrict(district.district_id);
                        });
                    })
                resolve(true);
            });
            return response;
        }
        catch(err) {
            console.log(err);
        }
    }

    async unlockDeclaringCity(username) {
        try {
            const response = await new Promise(async (resolve, reject) => {
                await FindLocationService.getAllDistricts(username)
                    .then(districts => {
                        districts.forEach(district => {
                            this.unlockDeclaringDistrict(district.district_id);
                        });
                    })
                resolve(true);
            });
            return response;
        }
        catch(err) {
            console.log(err);
        }
    }

}

module.exports = new UserService();
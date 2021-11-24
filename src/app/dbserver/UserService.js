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
                this.lockDeclaringWard(username);
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
                this.unlockDeclaringWard(username);
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
                this.lockDeclaringWard(username);
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
                this.unlockDeclaringWard(username);
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

    async lockDeclaringAllCities() {
        try {
            const response = await new Promise(async (resolve, reject) => {

                await FindLocationService.getAllCities()
                    .then(cities => {
                        cities.forEach(city => {
                            this.lockDeclaringCity(city.city_id);
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

    async unlockDeclaringAllCities() {
        try {
            const response = await new Promise(async (resolve, reject) => {

                await FindLocationService.getAllCities()
                    .then(cities => {
                        cities.forEach(city => {
                            this.unlockDeclaringCity(city.city_id);
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

    async getUserNodeChild(username) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM users WHERE username LIKE "${username}%"`;
                db.query(query, (err, users) => {
                    if (err) reject(new Error(err.message));
                    const result = users.filter(user => {
                        return user.username.length === username.length + 2;
                    });
                    resolve(result);
                });
            });
            return response;
        }
        catch(err) {
            console.log(err);
        }
    }

    async declaringDoneForWard(username) {
        try {
            const response = await new Promise((resolve, reject) => {
                this.getUserByUsername(username)
                    .then(user => {
                        if (!user[0]) {
                            resolve({
                                error: true,
                                msg: 'Không tìm thấy người dùng'
                            })
                        }
                        else {
                            const query = 'UPDATE users SET declaringDone = 1 WHERE username = ?';
                            db.query(query, [username], async (err, result) => {
                                if (err) return reject(new Error(err.message));
                                await this.declaringDoneForDistrict(username.slice(0, username.length - 2));
                                resolve(true);
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

    async declaringDoneForDistrict(username) {
        // try {
        //     const response = await new Promise(async (resolve, reject) => {
                
        //         resolve(result);
        //     });
        //     return response;
        // }
        // catch(err) {
        //     console.log(err);
        // }
        const childNodeUsers = await this.getUserNodeChild(username);
        const result = childNodeUsers.every(childNodeUser => {
            return childNodeUser.declaringDone;
        });
        if (result) {
            const query = 'UPDATE users SET declaringDone = 1 WHERE username = ?';
            db.query(query, [username], (err, result) => {
                this.declaringDoneForCity(username.slice(0, username.length - 2));
            })
        }
    }

    async declaringDoneForCity(username) {
        const childNodeUsers = await this.getUserNodeChild(username);
        const result = childNodeUsers.every(childNodeUser => {
            return childNodeUser.declaringDone;
        });
        if (result) {
            const query = 'UPDATE users SET declaringDone = 1 WHERE username = ?';
            db.query(query, [username], (err, result) => {
                this.declaringDoneForCity(username.slice(0, username.length - 2));
            })
        }
    }


    // changeNumber(number) {
    //     if (number < 10) {
    //         return '0' + number.toString();
    //     }
    //     else {
    //         return number.toString();
    //     }    
    // }
    // async changeDatabase() {
    //     try {
    //         const response = await new Promise((resolve, reject) => {
    //             // const query = 'SELECT * FROM quanhuyen';
    //             // db.query(query, async (err, result) => {
    //             //     if (err) reject(new Error(err.message));
    //             //     let ward_id = 1;
    //             //     let matp1 = 'a';
    //             //     for (var i = 0; i < result.length; i++) {
    //             //         if (result[i].matp !== matp1) {
    //             //             ward_id = 1;
    //             //             matp1 = result[i].matp;
    //             //         }
    //             //         const newMaqh = result[i].matp.toString() + this.changeNumber(ward_id);
    //             //         const update1Query = `UPDATE xaphuong SET maqh = "${newMaqh}" WHERE maqh = "${result[i].maqh}"`
    //             //         await db.query(update1Query);
    //             //         const updateQuery = `UPDATE quanhuyen SET maqh = "${newMaqh}" WHERE stt = ${result[i].stt}`;
    //             //         await db.query(updateQuery);
    //             //         ward_id++;
    //             //     }

    //             //     resolve(result);
    //             // });
    //             const query = 'SELECT * FROM xaphuong_1';
    //             db.query(query, async (err, result) => {
    //                 if (err) reject(new Error(err.message));
    //                 let ward_id = 1;
    //                 let matp1 = 'a';
    //                 for (var i = 0; i < result.length; i++) {
    //                     if (result[i].maqh !== matp1) {
    //                         ward_id = 1;
    //                         matp1 = result[i].maqh;
    //                     }
    //                     const newMaqh = result[i].maqh.toString() + this.changeNumber(ward_id);
    //                     const updateQuery = `UPDATE xaphuong_1 SET xaid = "${newMaqh}" WHERE stt = ${result[i].stt}`;
    //                     await db.query(updateQuery);
    //                     ward_id++;
    //                 }
    //                 /*
    //                 DROP TABLE xaphuong_1;
    //                 CREATE TABLE xaphuong_1 AS SELECT * FROM xaphuong ORDER BY maqh;
    //                 DROP TABLE quanhuyen;
    //                 CREATE TABLE quanhuyen as SELECT * FROM devvn_quanhuyen ORDER BY matp;
    //                 DROP TABLE xaphuong;
    //                 CREATE TABLE xaphuong as SELECT * FROM devvn_xaphuongthitran ORDER BY maqh;
    //                 ALTER TABLE quanhuyen 
    //                 ADD COLUMN stt INT AUTO_INCREMENT PRIMARY KEY;
    //                 ALTER TABLE xaphuong
    //                 ADD COLUMN stt INT AUTO_INCREMENT PRIMARY KEY;
    //                 */
    //                 resolve(result);
    //             });
    //         });
    //         return response;
    //     }
    //     catch(err) {
    //         console.log(err);
    //     }
    // }
}

module.exports = new UserService();
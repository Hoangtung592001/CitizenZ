const db = require('./models/model');
const EncryptService = require('../service/encryptService');
const bcrypt = require('bcrypt');
const FindLocationService = require('./FindLocationService');
db.connect();

class UserService {
    // Thên một users mới
    async addUser(user) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `INSERT INTO users(username, password, role) VALUES("${user.username}", "${user.password}", "${user.role}") `;
                db.query(query, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            })
            return response === 1 ? true : false;
        }
        catch(err) {
            console.log(err);
        }
    }

    async grantPrivileges(id, startTime, expiryTime) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `UPDATE users SET` +  
                    ` startTime = '${startTime}', expiryTime = '${expiryTime}'` +
                    ` WHERE username = ${id}`;
                db.query(query, (err, result) => {
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

    // Thêm nhiều users cùng một lúc.

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

    // Lấy về users qua tên đăng nhập.
    // UserService.getUserByUsername
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

    // set lại password cho user

    async setPassword(username, newPassword) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `UPDATE users` + 
                ` SET password = '${newPassword}' WHERE username = '${username}'`;
                db.query(query, (err, result) => {
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

    // Check người này có đủ quyền làm việc gì đó không.

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

    // Khóa quyền khai báo cho một làng

    async lockDeclaringVillage(username) {
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

    // Mở Khóa quyền khai báo cho một làng

    async unlockDeclaringVillage(username) {
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

    // Khóa quyền khai báo cho các làng trong một xã

    async lockDeclaringWard(username) {
        try {
            const response = await new Promise(async (resolve, reject) => {
                this.lockDeclaringVillage(username);
                await FindLocationService.getAllVillages(username)
                    .then(villages => {
                        villages.forEach(village => {
                            this.lockDeclaringVillage(village.village_id);
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

    // Mở Khóa quyền khai báo cho các làng trong một xã

    async unlockDeclaringWard(username) {
        try {
            const response = await new Promise(async (resolve, reject) => {
                this.unlockDeclaringVillage(username);
                await FindLocationService.getAllVillages(username)
                    .then(villages => {
                        villages.forEach(village => {
                            this.unlockDeclaringVillage(village.village_id);
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

    // Khóa quyền khai báo cho các xã trong một huyện

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

    // Mở Khóa quyền khai báo cho các xã trong một huyện

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

    // Khóa quyền khai báo cho các huyện trong một tỉnh

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

    // Mở Khóa quyền khai báo cho các huyện trong một tỉnh

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

    // Khóa quyền khai báo cho các tỉnh

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

    // Mở Khóa quyền khai báo cho các tỉnh

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

    // Lấy về thông tin các huyện của tỉnh, xã của huyện hay làng của xã.

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
    // Xác nhận Khai báo xong cho một xã

    async declaringDoneForWard(username) {
        try {
            const response = await new Promise((resolve, reject) => {
                this.getUserByUsername(username)
                    .then(async user => {
                        if (!user[0]) {
                            resolve({
                                error: true,
                                msg: 'Không tìm thấy người dùng'
                            })
                        }
                        else {
                            await this.getUserNodeChild(username)
                                .then(async children => {
                                    await Promise.all(children.map(async child => {
                                        const updateQuery = 'UPDATE users SET declaringDone = 0, startTime = NULL, expiryTime = NULL WHERE username = ?';
                                        db.query(updateQuery, [child.username]);
                                    }))
                                });
                            const query = 'UPDATE users SET declaringDone = 0, startTime = NULL, expiryTime = NULL WHERE username = ?';
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

    // Xác nhận Khai báo xong cho một huyện

    async declaringDoneForDistrict(username) {
        const childNodeUsers = await this.getUserNodeChild(username);
        const result = childNodeUsers.every(childNodeUser => {
            return childNodeUser.declaringDone;
        });
        if (result) {
            const query = 'UPDATE users SET declaringDone = 1, startTime = NULL, expiryTime = NULL WHERE username = ?';
            db.query(query, [username], (err, result) => {
                this.declaringDoneForCity(username.slice(0, username.length - 2));
            })
        }
    }

    // Xác nhận Khai báo xong cho một tỉnh

    async declaringDoneForCity(username) {
        const childNodeUsers = await this.getUserNodeChild(username);
        const result = childNodeUsers.every(childNodeUser => {
            return childNodeUser.declaringDone;
        });
        if (result) {
            const query = 'UPDATE users SET declaringDone = 1, startTime = NULL, expiryTime = NULL WHERE username = ?';
            db.query(query, [username], (err, result) => {
                this.declaringDoneForCity(username.slice(0, username.length - 2));
            })
        }
    }

    async grantCode(id, name, parentId) {
        try {
            const response = await new Promise((resolve, reject) => {
                let query;
                if (id.length === 2) {
                    query = `INSERT INTO cities(city_id, name) VALUES('${id}', '${name}')`;
                }
                else if (id.length === 4) {
                    query = `INSERT INTO districts(district_id, name, city_id) VALUES('${id}', '${name}', '${parentId}')`;
                }
                else if (id.length === 6) {
                    query = `INSERT INTO wards(ward_id, name, district_id) VALUES('${id}', '${name}', '${parentId}')`;
                }
                else if (id.length === 8) {
                    query = `INSERT INTO villages(village_id, name, ward_id) VALUES('${id}', '${name}', '${parentId}')`;
                }
                // const query = `INSERT INTO identification_for_levels VALUES('${id}')`;
                db.query(query, (err, result) => {
                    if (err) reject(new Error(err.message))
                    else {
                        resolve(result);
                    }
                });
            });
            return response;
        }
        catch(err) {
            console.log(err);
        }
    }

    async findGrantedCode(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                let query;
                if (id.length === 2) {
                    query = 'SELECT * FROM cities WHERE city_id = ?';
                }
                else if (id.length === 4) {
                    query = 'SELECT * FROM districts WHERE district_id = ?';
                }
                else if (id.length === 6) {
                    query = 'SELECT * FROM wards WHERE ward_id = ?';
                }
                else if (id.length === 8) {
                    query = 'SELECT * FROM villages WHERE village_id = ?';
                }
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

    async updatePrivileges(userId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SET declaringDone = CASE WHEN' + 
                ' NOW() >= startTime AND NOW() <= expiryTime THEN TRUE ELSE FALSE END' +
                ' WHERE username = ?';
                db.query(query, [userId], (err, result) => {
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

    async grantedUser(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                let query;
                if (id === 'city') {
                    query = 'SELECT * FROM cities c JOIN users u ON c.city_id = u.username';
                }
                else if (id.length === 2) {
                    query = 'SELECT * FROM districts d JOIN users u ON d.district_id = u.username WHERE d.city_id = ?';
                }
                else if (id.length === 4) {
                    query = 'SELECT * FROM wards w JOIN users u ON w.ward_id = u.username WHERE w.district_id = ?';
                }
                else if (id.length === 6) {
                    query = 'SELECT * FROM villages v JOIN users u ON v.village_id = u.username WHERE v.ward_id = ?';
                }
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

    // async randomVilages() {
    //     try {
    //         const response = await new Promise((resolve, reject) => {
    //             const villages = ['Thôn', 'Bản', 'Phố'];
    //             const midName = ['Ninh', 'Hòa', 'Sinh', 'Hậu', 'Bình', 'Bắc', 'Mau', 'Minh', 'Hồ', 'Giang', 'Long',
    //                                 'Kiều', 'Định', 'Nam', 'Phong', 'Phúc'];
    //             const wardQuery = 'SELECT * FROM wards';
    //             db.query(wardQuery, (err, wards) => {
    //                 const wards_id = wards.map(ward => {
    //                     return ward.ward_id;
    //                 })
    //                 //Math.floor(Math.random() * max)
    //                 const query = 'INSERT INTO villages SET ?'
    //                 for (var i = 0; i < 100000; i++) {
    //                     const randomVillages = Math.floor(Math.random() * 3);
    //                     const randommidName1 = Math.floor(Math.random() * midName.length);
    //                     const randommidName2 = Math.floor(Math.random() * midName.length);
    //                     const randomWard_id = Math.floor(Math.random() * wards_id.length);
    //                     const village = {
    //                         "name": villages[randomVillages] + ' ' + midName[randommidName1] + ' ' + midName[randommidName2],
    //                         "type": villages[randomVillages],
    //                         "ward_id": wards_id[randomWard_id]
    //                     }
    //                     db.query(query, [village]);
    //                 }
    //                 resolve(true);
    //             })

    //         });
    //         return response;
    //     }
    //     catch(err) {
    //         console.log(err);
    //     }
        
    // }


//     changeNumber(number) {
//         if (number < 10) {
//             return '0' + number.toString();
//         }
//         else {
//             return number.toString();
//         }    
//     }
//     async changeDatabase() {
//         try {
//             const response = await new Promise((resolve, reject) => {
//                 // const query = 'SELECT * FROM quanhuyen';
//                 // db.query(query, async (err, result) => {
//                 //     if (err) reject(new Error(err.message));
//                 //     let ward_id = 1;
//                 //     let matp1 = 'a';
//                 //     for (var i = 0; i < result.length; i++) {
//                 //         if (result[i].matp !== matp1) {
//                 //             ward_id = 1;
//                 //             matp1 = result[i].matp;
//                 //         }
//                 //         const newMaqh = result[i].matp.toString() + this.changeNumber(ward_id);
//                 //         const update1Query = `UPDATE xaphuong SET maqh = "${newMaqh}" WHERE maqh = "${result[i].maqh}"`
//                 //         await db.query(update1Query);
//                 //         const updateQuery = `UPDATE quanhuyen SET maqh = "${newMaqh}" WHERE stt = ${result[i].stt}`;
//                 //         await db.query(updateQuery);
//                 //         ward_id++;
//                 //     }

//                 //     resolve(result);
//                 // });
//                 const query = 'SELECT * FROM citi_1';
//                 db.query(query, async (err, result) => {
//                     if (err) reject(new Error(err.message));
//                     let city_id = 1;
//                     let matp1 = 'a';
//                     for (var i = 0; i < result.length; i++) {
//                         // if (result[i].city_id !== matp1) {
//                         //     city_id = 1;
//                         //     matp1 = result[i].city_id;
//                         // }
//                         const newMaqh = this.changeNumber(city_id);
//                         const updateQuery = `UPDATE citi_1 SET city_id = "${newMaqh}" WHERE stt = ${result[i].stt}`;
//                         const updateQuery2 = `UPDATE district_1 SET city_id=${newMaqh} WHERE city_id = ${result[i].city_id}`;
//                         await db.query(updateQuery);
//                         await db.query(updateQuery2);
//                         city_id++;
//                     }
//                     /*
//                     DROP TABLE xaphuong_1;
//                     CREATE TABLE xaphuong_1 AS SELECT * FROM xaphuong ORDER BY maqh;
//                     DROP TABLE quanhuyen;
//                     CREATE TABLE quanhuyen as SELECT * FROM devvn_quanhuyen ORDER BY matp;
//                     DROP TABLE xaphuong;
//                     CREATE TABLE xaphuong as SELECT * FROM devvn_xaphuongthitran ORDER BY maqh;
//                     ALTER TABLE quanhuyen 
//                     ADD COLUMN stt INT AUTO_INCREMENT PRIMARY KEY;
//                     ALTER TABLE xaphuong
//                     ADD COLUMN stt INT AUTO_INCREMENT PRIMARY KEY;
// DROP TABLE IF EXISTS cities_1;
// DROP TABLE IF EXISTS district_1;
// DROP TABLE IF EXISTS ward_1;
// DROP TABLE IF EXISTS village_1;
// CREATE TABLE cities_1 AS SELECT * FROM cities;
// CREATE TABLE district_1 AS SELECT * FROM districts;
// CREATE TABLE ward_1 AS SELECT * FROM wards;
// CREATE TABLE village_1 AS SELECT * FROM villages;
// ALTER TABLE cities_1 ADD COLUMN stt INT AUTO_INCREMENT PRIMARY KEY;
// ALTER TABLE district_1 ADD COLUMN stt INT AUTO_INCREMENT PRIMARY KEY;
// ALTER TABLE ward_1 ADD COLUMN stt INT AUTO_INCREMENT PRIMARY KEY;
// ALTER TABLE village_1 ADD COLUMN stt INT AUTO_INCREMENT PRIMARY KEY;

// CREATE EVENT IF NOT EXISTS updateDeclaration
// ON SCHEDULE EVERY 1 MINUTE
// DO 
// UPDATE users
// SET declaringDone = CASE WHEN NOW() >= startDay AND NOW() <= expiryDay THEN TRUE ELSE FALSE END
//                     */
//                     resolve(result);
//                 });
//             });
//             return response;
//         }
//         catch(err) {
//             console.log(err);
//         }
//     }


}

module.exports = new UserService();
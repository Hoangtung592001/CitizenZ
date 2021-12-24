const db = require('./models/Citizen_Model');
const UserService = require('./UserService');
const FindLocationService = require('./FindLocationService');
const amqp = require("amqplib");
const sendByMail = require("../service/sendMessagesThroughGmail");

db.connect();

class CitizenService {
    
    // Lấy thông tin một người dân dựa vào số cmt
    async getCitizenById(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT c.*, e.*, v.village_id, v.name village_name,' +
                ' w.ward_id, w.name ward_name, d.district_id, d.name district_name, ci.city_id, ci.name city_name' +
                ' FROM citizens c' +
                ' JOIN ethnic_groups e ON c.ethnic_id = e.ethnic_id' +
                ' JOIN villages v ON c.village_id = v.village_id' +
                ' JOIN wards w ON w.ward_id = v.ward_id' +
                ' JOIN districts d ON w.district_id = d.district_id' +
                ' JOIN cities ci ON d.city_id = ci.city_id' +
                ' WHERE c.citizen_id = ?';
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

    // Hàm thêm một công dân.
    async addCitizen(citizen) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO citizens SET ? ';
                db.query(query, [citizen], (err, result) => {
                    /**
                    `UPDATE villages SET population = population + 1 WHERE village_id = ${village_id};` +
                    ` UPDATE wards SET population = population + 1 WHERE ward_id = ${ward_id};` +
                    ` UPDATE districts SET population = population + 1 WHERE district_id = ${district_id};` +
                    ` UPDATE cities SET population = population + 1 WHERE city_id = ${city_id};`;
                     */
                    if (err) reject(new Error(err.message));
                    const village_id = citizen.village_id;
                    const ward_id = village_id.slice(0, 6);
                    const district_id = village_id.slice(0, 4);
                    const city_id = village_id.slice(0, 2);
                    const addPopulationVillageQuery = `UPDATE villages SET population = population + 1 WHERE village_id = ${village_id};`;
                    const addPopulationWardQuery = `UPDATE wards SET population = population + 1 WHERE ward_id = ${ward_id};`
                    const addPopulationDistrictQuery = `UPDATE districts SET population = population + 1 WHERE district_id = ${district_id};`
                    const addPopulationCityQuery = `UPDATE cities SET population = population + 1 WHERE city_id = ${city_id};`;
                    db.query(addPopulationVillageQuery);
                    db.query(addPopulationWardQuery);
                    db.query(addPopulationDistrictQuery);
                    db.query(addPopulationCityQuery);
                    resolve(result);
                });
            });
            return response;
        }
        catch(err) {
            console.log(err);
        }
    }

    // Hàm xóa một công dân.
    async deleteCitizen(citizen) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'DELETE FROM citizens WHERE citizen_id = ?'
                db.query(query, [citizen.citizen_id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    const village_id = citizen.village_id;
                    const ward_id = village_id.slice(0, 6);
                    const district_id = village_id.slice(0, 4);
                    const city_id = village_id.slice(0, 2);
                    const deletePopulationVillageQuery = `UPDATE villages SET population = population - 1 WHERE village_id = ${village_id};`;
                    const deletePopulationWardQuery = `UPDATE wards SET population = population - 1 WHERE ward_id = ${ward_id};`
                    const deletePopulationDistrictQuery = `UPDATE districts SET population = population - 1 WHERE district_id = ${district_id};`
                    const deletePopulationCityQuery = `UPDATE cities SET population = population - 1 WHERE city_id = ${city_id};`;
                    db.query(deletePopulationVillageQuery);
                    db.query(deletePopulationWardQuery);
                    db.query(deletePopulationDistrictQuery);
                    db.query(deletePopulationCityQuery);
                    resolve(result);
                })
            });
            return response;
        }
        catch(err) {
            console.log(err.message);
        }
    }

    // Hàm thay đổi thông tin một công dân

    async changeInfoCitizen(citizen_id, citizen) {
        try {
            const response = await new Promise(async (resolve, reject) => {
                const findCitizenQuery = 'SELECT * FROM citizens WHERE citizen_id = ?';
                db.query(findCitizenQuery, [citizen_id], async (err, foundCitizen) => {
                    // Trường hợp không thay đổi làng.
                    const query = `UPDATE citizens` + 
                    ` SET ? WHERE citizen_id = "${citizen_id}"`;
                    db.query(query, [citizen], (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result);
                    });
                    // if (citizen.village_id === foundCitizen[0].village_id) {
                    // }
                    // // Trường hợp thay đổi làng.
                    // else {
                    //     const amqpServer = "amqp://localhost:5672";
                    //     const connection = await amqp.connect(amqpServer);
                    //     const channel = await connection.createChannel();
                    //     const QUEUE = `sendConfirm`
                    //     await channel.assertQueue(QUEUE);
                    //     //http://localhost:5000/information/confirm_changeInfo
                    //     await sendByMail.confirmChangePassword('Xác nhận chuyển nơi ở', 'http://localhost:5000/information/confirm_changeInfo');
                    //     channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(citizen)));
                    //     channel.consume('confirmMessage', async (msg) => {
                    //         await this.deleteCitizen(foundCitizen[0]);
                    //         await this.addCitizen(citizen);
                    //         resolve(true);
                    //     }, {
                    //         noAck: true
                    //     });
                    // }
                });
            });
            return response;
        }
        catch(err) {
            console.log(err);
        }
    }

    // Hàm check xem người dùng này còn quyền modify hay không tức là hết hạn khai báo.
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
                        if (!checkingUser.declaringDone) {
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

    // Lấy thông tin các công dân dựa vào ô input search

    async getCitizensBySearchValue(searchValue) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM citizens WHERE citizen_name LIKE '%${searchValue}%'`;
                db.query(query, (err, citizens) => {
                    if (err) reject (new Error(err.message));
                    resolve(citizens);
                });
            });
            return response;
        }

        catch(err) {
            console.log(err);
        }
    }
    // Trả ra kết quả là tất cả dân cư của một cấp nào đó tùy thuộc vào id.    
    async getCitizensOfLevels(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                let query = '';
                if (id === 'city') {
                    query = 'SELECT * FROM citizens';
                }
                else {
                    query = `SELECT * FROM citizens WHERE village_id LIKE '${id}%'`;
                }
                console.log(query);
                db.query(query, (err, citizens) => {
                    if (err) reject(new Error(err.message));
                    resolve(citizens);
                });
            });
            return response;
        }
        catch(err) {
            console.log(err);
        }
    }
}

module.exports = new CitizenService();
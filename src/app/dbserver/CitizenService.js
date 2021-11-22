const db = require('./models/Citizen_Model');
const UserService = require('./UserService');
const FindLocationService = require('./FindLocationService');
const amqp = require("amqplib");

db.connect();

class CitizenService {

    async addCitizen(citizen) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO citizens SET ? ';
                db.query(query, [citizen], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                    const addPopulationQuery = `UPDATE wards SET population = population + 1 WHERE ward_id = ${citizen.ward_id}`;
                    db.query(addPopulationQuery, (err, isAdded) => {
                        if (err) reject(new Error(err.message));
                    })
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
            const response = await new Promise(async (resolve, reject) => {
                if (!citizen.ward_id) {
                    const query = `UPDATE citizens` + 
                    ` SET ? WHERE citizen_id = "${citizen_id}"`;
                    db.query(query, [citizen], (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result);
                    });
                }
                else {
                    const amqpServer = "amqp://localhost:5672";
                    const connection = await amqp.connect(amqpServer);
                    const channel = await connection.createChannel();
                    const QUEUE = `sendConfirm`
                    await channel.assertQueue(QUEUE);
                    channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(citizen)));
                    channel.consume('confirmMessage', (msg) => {
                        console.log(msg.content);
                        const findCitizen = 'SELECT * FROM citizens WHERE citizen_id = ?';
                        db.query(findCitizen, [citizen_id], (err, foundCitizen) => {
                            const newWard = citizen.ward_id;
                            const oldWard = foundCitizen[0].ward_id;
                            const updateQuery = `UPDATE citizens` + 
                            ` SET ? WHERE citizen_id = "${citizen_id}"`;
                            db.query(updateQuery, [citizen], (err, result) => {
                                if (err) reject(new Error(err.message));
                            });
                            const deletePopulationQuery = `UPDATE wards SET population = population - 1 WHERE ward_id = ${oldWard}`;
                            db.query(deletePopulationQuery, (err, isDeleted) => {
                                if (err) reject(new Error(err.message));
                            })
                            const addPopulationQuery = `UPDATE wards SET population = population + 1 WHERE ward_id = ${newWard}`;
                            db.query(addPopulationQuery, (err, isAdded) => {
                                if (err) reject(new Error(err.message));
                            })
                        })
                        resolve(true);
                    }, {
                        noAck: true
                    });
                }
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
                const query = 'SELECT c.city_id, c.name, SUM(w.population) as population FROM cities c' +
                ' JOIN districts d ON c.city_id = d.city_id' +
                ' JOIN wards w ON d.district_id = w.district_id' +
                ' GROUP BY c.city_id';
                db.query(query, (err, cities) => {
                    if (err) reject(new Error(err.message));
                    resolve(cities);
                })
            });
            return response;
        }
        catch(err) {
            console.log(err);
        }
    }

    async deleteCitizen(citizen) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'DELETE FROM citizens WHERE citizen_id = ?'
                db.query(query, [citizen.citizen_id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                    const deletePopulationQuery = `UPDATE wards SET population = population - 1 WHERE ward_id = ${citizen.ward_id}`;
                    db.query(deletePopulationQuery, (err, isDeleted) => {
                        if (err) reject(new Error(err.message));
                    })
                })
            });
            return response;
        }
        catch(err) {
            console.log(err.message);
        }
    }
}

module.exports = new CitizenService();
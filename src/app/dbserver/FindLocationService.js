const db = require('./models/City_Model');

db.connect();

class FindLocationService {
    // Lấy tất cả các cities trên cả nước
    async getAllCities() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM cities';
                db.query(query, (err, cities) => {
                    if (err) reject(new Error(err.message));
                    resolve(cities);
                })
            });
            return response;
        }
        catch(err) {
            throw err;
        }
    }

    // Lấy về các huyện trên một tỉnh nhất định

    async getAllDistricts(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM districts WHERE city_id = ?'
                db.query(query, [id], (err, districts) => {
                    if (err) reject(new Error(err.message));
                    resolve(districts);
                })
            })
            return response;
        }
        catch(err) {
            throw err;
        }
    }

    // Lấy về các xã trên một huyện nhất định

    async getAllWards(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM wards WHERE district_id = ?'
                db.query(query, [id], (err, wards) => {
                    if (err) reject(new Error(err.message));
                    resolve(wards);
                })
            })
            return response;
        }
        catch(err) {
            throw err;
        }
    }

    // Lấy về các làng trên một xã nhất định

    async getAllVillages(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM villages WHERE ward_id = ?'
                db.query(query, [id], (err, villages) => {
                    if (err) reject(new Error(err.message));
                    resolve(villages);
                })
            })
            return response;
        }
        catch(err) {
            throw err;
        }
    }

    // Lấy thông tin các tỉnh và xem tỉnh này khai báo xong chưa

    async getCitiesInfo() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT c.*, u.declaringDone FROM cities c JOIN users u ON c.city_id = u.username';
                db.query(query, (err, result) => {
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



    async getInfoOfLevels(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                let query;
                if (id === 'city') {
                    query = 'SELECT c.*, u.declaringDone FROM cities c JOIN users u ON c.city_id = u.username';
                }
                else if (id.length === 2) {
                    query = 'SELECT d.*, u.declaringDone FROM districts d JOIN users u ON d.district_id = u.username WHERE d.city_id = ?';
                }
                else if (id.length === 4) {
                    query = 'SELECT w.*, u.declaringDone FROM wards w JOIN users u ON w.ward_id = u.username WHERE w.district_id = ?';
                }
                else if (id.length === 6) {
                    query = 'SELECT v.*, u.declaringDone FROM villages v JOIN users u ON v.village_id = u.username WHERE v.ward_id = ?';
                }
                else {
                    query = 'SELECT * FROM citizens c WHERE c.village_id = ?';
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

    async getInfoOfLevel(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                let query;
                if (id.length === 2) {
                    query = `SELECT * FROM cities WHERE city_id = ${id}`;
                }
                else if (id.length === 4) {
                    query = `SELECT * FROM districts WHERE district_id = ${id}`;
                }
                else if (id.length === 6) {
                    query = `SELECT * FROM wards WHERE ward_id = ${id}`;
                }
                else {
                    query = `SELECT * FROM villages WHERE village_id = ${id}`;
                }
                db.query(query, (err, result) => {
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

    // Lấy về thông tin về một tỉnh, huyện, xã nhưng không có thông tin users như kiểu khai báo xong chưa,...

    async getInfoOfLevelsNoUser(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                let query;
                if (id === 'city') {
                    query = 'SELECT * FROM cities';
                }
                else if (id.length === 2) {
                    query = 'SELECT * FROM districts d WHERE d.city_id = ?';
                }
                else if (id.length === 4) {
                    query = 'SELECT * FROM wards w WHERE w.district_id = ?';
                }
                else if (id.length === 6) {
                    query = 'SELECT * FROM villages v WHERE v.ward_id = ?';
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

    // Lấy về các nước trên thế giới render vào form khai báo công dân.

    async getCountries() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM countries';
                db.query(query, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            })
            return response;
        }
        catch(err) {
            console.log(err);
        }
    }

    // Lấy về các dân tộc trên cả nước render vào form khai báo công dân.

    async getEthnicGroups() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM ethnic_groups';
                try {
                    db.query(query, (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result);
                    })
                }
                catch(err) {
                    reject(new Error(err.message));
                }
            })
            return response;
        }
        catch(err) {
            console.log(err);
        }
    }
    /*
    SELECT c.* FROM cities c
    JOIN districts d ON c.city_id = d.city_id
    JOIN wards w ON w.district_id = d.district_id
    JOIN villages v ON w.ward_id =  v.ward_id;
    */
}

module.exports = new FindLocationService();
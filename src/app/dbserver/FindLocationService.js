const db = require('./models/City_Model');

db.connect();

class FindLocationService {
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
}

module.exports = new FindLocationService();
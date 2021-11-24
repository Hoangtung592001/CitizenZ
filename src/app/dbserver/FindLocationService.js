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

    async getCitizensOfDistricts(city_id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT d.district_id, d.name, SUM(w.population) as population FROM districts d' +
                ' JOIN wards w ON d.district_id = w.district_id' +
                ' WHERE city_id = ?' +
                ' GROUP BY d.district_id;'
                db.query(query, [city_id], (err, districts) => {
                    if (err) reject(new Error(err.message));
                    resolve(districts);
                })
            });
            return response;
        }
        catch(err) {
            console.log(err);
        }
    }

    async getCitizensOfWards(district_id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM wards' +
                ' WHERE district_id = ?'
                db.query(query, [district_id], (err, wards) => {
                    if (err) reject(new Error(err.message));
                    resolve(wards);
                })
            });
            return response;
        }
        catch(err) {
            console.log(err);
        }
    }
}

module.exports = new FindLocationService();
const db = require('./models/City_Model');

db.connect();

class CityService {
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

    async getCityById(id) {

    }
}

module.exports = new CityService();
const db = require('./models/Citizen_Model');

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

    async changeInfoCitizen(citizen) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `UPDATE citizens` + 
                ` SET ? WHERE citizen_id = "${citizen.citizen_id}"`;
                db.query(query, [citizen], (err, result) => {
                    if (err) resolve(false);
                    resolve(result.affectedRows);
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
const bcrypt = require('bcrypt');
const UserService = require('../dbserver/UserService');
class EncryptService {
    
    async encryptSingle(info) {
        try {
            const salt = await bcrypt.genSalt(10);
            return bcrypt.hash(info, salt);
        }
        catch(err) {
            throw err;
        }
    }
}

module.exports = new EncryptService();
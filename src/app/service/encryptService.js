const bcrypt = require('bcrypt');
const UserService = require('../dbserver/UserService');

// đây là service dùng đẻ mã hóa một thông tin.
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
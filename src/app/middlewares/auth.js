const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

module.exports = function(req, res, next) {
    // const accessToken = req.headers.authorization.split(' ')[1] || 
    const accessToken = req.cookies.token;
    if (!accessToken) {
        return res.status(400).json({
            error: true,
            msg: 'No token, access denied',
        });
    }
    try {
        jwt.verify(accessToken, process.env.AUTH_SECRET, function(err, user) {
            req.user = user;
        })
        next();
    }
    catch(err) {
        res.status(401).json({
            msg: 'Token is not valid',
        });
    }
}
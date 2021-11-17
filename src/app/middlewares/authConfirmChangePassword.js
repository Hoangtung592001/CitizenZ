const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../models/Site');

module.exports = function(req, res, next) {
    const accessToken = req.cookies.confirmChangePasswordToken;
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
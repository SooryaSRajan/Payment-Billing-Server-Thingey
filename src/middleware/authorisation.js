const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const Vendor = require('../models/vendor');
const config = require('../utils/config');

module.exports = function (role) {
    return async function (req, res, next) {
        const token = req.header('Token');
        if (!token) return res.status(401).send('Access denied. No token provided.');
        try {
            const decoded = jwt.verify(token, config.TOKEN);
            if (role === 'admin') {
                const admin = await Admin.findById(decoded._id);
                req.user = admin;
                if (!admin) return res.status(401).send('Access denied. User is not an admin.');
            } else if (role === 'vendor') {
                const vendor = await Vendor.findById(decoded._id);
                req.user = vendor;
                if (!vendor) return res.status(401).send('Access denied. User is not a vendor.');
            }
            next();
        } catch (ex) {
            res.status(400).send('Invalid token.');
        }
    }
}
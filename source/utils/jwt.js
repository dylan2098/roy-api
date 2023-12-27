const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

const Instance = require('./singleton');
class JWT {
    constructor() { }

    static async sign(obj) {
        const token = await jwt.sign(obj, Instance.getInstanceHelper().getSecretKey(), { expiresIn: Instance.getInstanceHelper().getExpiresIn() })
        if (!token)
            return false;

        return token;
    }

    static async verify(token) {
        try {
            let obj = await jwt.verify(token, Instance.getInstanceHelper().getSecretKey(), { ignoreExpiration: true });

            if (obj) {
                delete obj.exp;
                delete obj.iat;
                return obj;
            }

        } catch (error) { }
    }

    static async hash(password) {
        const salt = await bcrypt.genSalt(Instance.getInstanceHelper().getGenSalt());
        return bcrypt.hash(password, salt);
    }

    // compare password
    static compare(password, userPassword) {
        return bcrypt.compare(password, userPassword);
    }

}

module.exports = JWT;
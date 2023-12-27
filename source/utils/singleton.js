class Singleton {
    constructor() { }

    // helper
    static getInstanceHelper() {
        return require('./helper');
    }

    // regex
    static getInstanceRegex() {
        return require('./regex');
    }

    // status
    static getInstanceStatus() {
        return require('./status');
    }

    // define status - role
    static getInstaceRoleStatus() {
        return require('./status-role');
    }

    static getInstanceJWT() {
        return require('./jwt');
    }

    static getInstanceMail() {
        return require('./mail');
    }

    static getInstanceHashids() {
        return require('./hashids');
    }

    static getInstanceCloudinary() {
        return require('./cloudinary');
    }
}

module.exports = Singleton;
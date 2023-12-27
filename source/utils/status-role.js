const statusRole = require('../settings/status-role.json');
class StatusRole {
    constructor() { }

    static getStatusValue(table, type) {
        return statusRole[table]["status"][type];
    }

    static getRoleValue(table, type) {
        return statusRole[table]["role"][type];
    }
}

module.exports = StatusRole;
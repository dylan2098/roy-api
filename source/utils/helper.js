const setting = require('../settings/general.json');
const database = require('../settings/database.json');
const Instance = require('./singleton');

class Helper {
    construct() { }

    static getApis() {
        return setting.LIST_API;
    }

    // get port server
    static getPort() {
        const port = process.env.PORT || setting.PORT;
        return port;
    }


    // get type of database for each environment
    static getDatabaseEnvironment(dbSystem) {
        const environment = process.env.NODE_ENV || setting.ENVIRONMENT;
        return database[environment][dbSystem];
    }


    // get max age
    static getMaxAge() {
        return setting.MAX_AGE;
    }


    // get secret key
    static getSecretKey() {
        return setting.SECRET_KEY;
    }

    // get gen salt
    static getGenSalt() {
        return setting.GEN_SALT;
    }

    //get expiresIn
    static getExpiresIn() {
        return setting.EXPIRESIN;
    }

    // get project name
    static getProjectName() {
        return setting.PROJECT_NAME;
    }


    // get param pagination 
    static getParamPagination(total, limit = 20, offset = 1, column = 'id', sort = 'desc') {
        if (limit <= 0) limit = 20;
        if (offset <= 1) offset = 1;

        let param = { column, sort };

        const canLoadMore = total - (offset - 1) * limit;

        if (canLoadMore <= 0 || canLoadMore <= limit)
            param.showMore = false;
        else
            param.showMore = true;

        param.limit = parseInt(limit);
        param.offset = parseInt(offset)
        param.numberOffset = (offset - 1) * limit;
        param.numberPages = this.getNumPages(total, limit);

        return param;
    }


    // check object 
    static isObject(obj) {
        if (obj && obj.constructor === Object && Object.keys(obj).length > 0)
            return true;
        return false;
    }

    // check length object
    static sizeObj(obj) {
        return Object.keys(obj).length;
    }


    static getCurrentDayFormat() {
        return moment().format('YYYY-MM-DD HH:mm:ss');
    }


    static convertDayToFormat(str_day) {
        return moment(str_day).format('YYYY-MM-DD HH:mm:ss');
    }


    // get number of pages
    static getNumPages(total, numberOfPage) {
        return Math.ceil(total / numberOfPage);
    }


    // compare ascending
    static compareAscending(value_1, value_2) {
        if (value_1 < value_2) {
            return -1;
        }

        if (value_1 > value_2) {
            return 1;
        }

        return 0;
    }

    // compare descending
    static compareDescending(value_1, value_2) {
        if (value_1 < value_2) {
            return 1;
        }

        if (value_1 > value_2) {
            return -1;
        }

        return 0;
    }



    // isAdmin
    static isAdmin(req) {
        if (req.id && req.role === Instance.getInstaceRoleStatus().getRoleValue("users", "admin")) {
            return true;
        }
        return false;
    }


    // isCustomer
    static isCustomer(req) {
        if (req.id && req.role === Instance.getInstaceRoleStatus().getRoleValue("users", "customer")) {
            return true;
        }
        return false;
    }
}

module.exports = Helper;
const knex = require('../../utils/database');
const moment = require('moment');
const Instance = require('../../utils/singleton');
class Coupon {
    constructor() { };

    static getAll(userId) {
        return knex('customer-address').select('*').where('userId', userId);
    }


    static create(customerData) {
        return knex('customer-address').insert(customerData);
    }


    static update(id, param) {
        return knex('customer-address').where('id', id).update(param);
    }


    static delete(id) {
        return knex('customer-address').where('id', id).del();
    }


    static async getOne(param) {
        let sql = knex('customer-address');

        if (param.id) {
            sql.where('id', param.id);
        }

        if (param.userId && param.type === "find-selected") {
            sql.where("selected", 1);
            sql.andWhere("userId", param.userId);
        }

        const customerAddress = await sql;
        if (customerAddress.length > 0) {
            return customerAddress[0];
        }

        return [];
    }


    static async isExist(param) {
        if (!param) {
            return false;
        }

        let sql = knex('customer-address');

        if (param.id) {
            sql.where('id', param.id);
        }

        const customerAddress = await sql;

        if (customerAddress.length > 0) {
            return true;
        }

        return false;
    }
}

module.exports = Coupon;
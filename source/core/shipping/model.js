const knex = require('../../utils/database');
const moment = require('moment');
const Instance = require('../../utils/singleton');
class Shipping {
    constructor() { };

    static getAll() {
        return knex('pricebook').select('*').orderBy('updatedAt', 'desc');
    }


    static create(data) {
        return knex('shipping').insert(data);
    }


    static update(id, param) {
        param.updatedAt = moment().format();
        return knex('shipping').where('id', id).update(param);
    }


    static delete(id) {
        return knex('shipping').where('id', id).del();
    }


    static async getOne(param) {
        let sql = knex('shipping');

        if (param.id) {
            sql.where('id', param.id);
        }

        const shipping = await sql;
        if (shipping.length > 0) {
            return shipping[0];
        }

        return [];
    }


    static async isExist(param) {
        if (!param) {
            return false;
        }

        let sql = knex('shipping');

        if (param.id) {
            sql.where('id', param.id);
        }

        const shipping = await sql;

        if (shipping.length > 0) {
            return true;
        }

        return false;
    }

    static async countTotal(search) {
        const sql = knex('shipping').count('id as count');

        if (search) {
            sql.where('shippingNo', 'like', `%${search}%`);
        }

        const res = await sql;

        return res[0].count;
    }


    static async paging(param) {
        const sql = knex('shipping').limit(param.limit).offset(param.numberOffset);
        if (param.column && param.sort) {
            sql.orderBy(param.column, param.sort);
        }

        if (param.search) {
            sql.where('shippingNo', 'like', `%${search}%`);
        }

        return await sql;;
    }
}

module.exports = Shipping;
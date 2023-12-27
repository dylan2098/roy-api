const knex = require('../../utils/database');
const moment = require('moment');
const Instance = require('../../utils/singleton');
class Coupon {
    constructor() { };

    static getAll() {
        return knex('coupon').select('*').orderBy('updatedAt', 'desc');
    }


    static create(group) {
        return knex('coupon').insert(group);
    }


    static update(id, param) {
        param.updatedAt = moment().format();
        return knex('coupon').where('id', id).update(param);
    }


    static delete(id) {
        return knex('coupon').where('id', id).del();
    }


    static async getOne(param) {
        let sql = knex('coupon');

        if (param.id) {
            sql.where('id', param.id);
        }

        const coupon = await sql;
        if (coupon.length > 0) {
            return coupon[0];
        }

        return [];
    }


    static async isExist(param) {
        if (!param) {
            return false;
        }

        let sql = knex('coupon');

        if (param.id) {
            sql.where('id', param.id);
        }

        const coupon = await sql;

        if (coupon.length > 0) {
            return true;
        }

        return false;
    }


    static async countTotal(search) {
        const sql = knex('coupon').count('id as count');

        if (search) {
            sql.where('code', 'like', `%${search}%`);
        }

        const res = await sql;

        return res[0].count;
    }


    static async paging(param) {
        const sql = knex('coupon').limit(param.limit).offset(param.numberOffset);
        if (param.column && param.sort) {
            sql.orderBy(param.column, param.sort);
        }

        if (param.search) {
            sql.where('code', 'like', `%${param.search}%`);
        }

        return await sql;;
    }
}

module.exports = Coupon;
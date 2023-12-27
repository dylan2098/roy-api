const knex = require('../../utils/database');
const moment = require('moment');

class Store {
    constructor() { };

    static getAll() {
        return knex('store').select('*');
    }


    static create(data) {
        return knex('store').insert(data);
    }


    static update(id, param) {
        param.updatedAt = moment().format();
        return knex('store').where('id', id).update(param);
    }


    static delete(id) {
        return knex('store').where('id', id).del();
    }


    static async getOne(param) {
        let sql = knex('store');

        if (param.id) {
            sql.where('id', param.id);
        }

        const data = await sql;
        if (data.length > 0) {
            return data[0];
        }

        return [];
    }


    static async isExist(param) {
        if (!param) {
            return false;
        }

        let sql = knex('store');

        if (param.id) {
            sql.where('id', param.id);
        }

        const data = await sql;

        if (data.length > 0) {
            return true;
        }

        return false;
    }

    static async countTotal(search) {
        const sql = knex('store').count('id as count');

        if (search) {
            sql.orWhere('phone_1', 'like', `%${search}%`);
            sql.orWhere('email', 'like', `%${search}%`);
            sql.orWhere('zipCode', 'like', `%${search}%`);
        }

        const res = await sql;

        return res[0].count;
    }


    static async paging(param) {
        const sql = knex('store').limit(param.limit).offset(param.numberOffset);
        if (param.column && param.sort) {
            sql.orderBy(param.column, param.sort);
        }

        if (param.search) {
            sql.orWhere('phone_1', 'like', `%${param.search}%`);
            sql.orWhere('email', 'like', `%${param.search}%`);
            sql.orWhere('zipCode', 'like', `%${param.search}%`);
        }

        return await sql;
    }
}

module.exports = Store;
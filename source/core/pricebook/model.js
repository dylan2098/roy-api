const knex = require('../../utils/database');
const moment = require('moment');
const Instance = require('../../utils/singleton');
class PriceBook {
    constructor() { };

    static getAll() {
        return knex('pricebook').select('*').orderBy('updatedAt', 'desc');
    }


    static create(data) {
        return knex('pricebook').insert(data);
    }


    static update(id, param) {
        param.updatedAt = moment().format();
        return knex('pricebook').where('id', id).update(param);
    }


    static delete(id) {
        return knex('pricebook').where('id', id).del();
    }


    static async getOne(param) {
        let sql = knex('pricebook');

        if (param.id) {
            sql.where('id', param.id);
        }

        const pricebook = await sql;
        if (pricebook.length > 0) {
            return pricebook[0];
        }

        return [];
    }


    static async isExist(param) {
        if (!param) {
            return false;
        }

        let sql = knex('pricebook');

        if (param.id) {
            sql.where('id', param.id);
        }

        const pricebook = await sql;

        if (pricebook.length > 0) {
            return true;
        }

        return false;
    }

    static async countTotal(search) {
        const sql = knex('pricebook').count('id as count');

        if (search) {
            sql.orWhere('name', 'like', `%${search}%`);
            sql.orWhere('currencyCode', 'like', `%${search}%`)
        }

        const res = await sql;

        return res[0].count;
    }


    static async paging(param) {
        const sql = knex('pricebook').limit(param.limit).offset(param.numberOffset);
        if (param.column && param.sort) {
            sql.orderBy(param.column, param.sort);
        }

        if (param.search) {
            sql.orWhere('name', 'like', `%${param.search}%`);
            sql.orWhere('currencyCode', 'like', `%${param.search}%`)
        }

        return await sql;;
    }
}

module.exports = PriceBook;
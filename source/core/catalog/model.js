const knex = require('../../utils/database');
const moment = require('moment');
const Instance = require('../../utils/singleton');
class Catalog {
    constructor() { };

    static getAll() {
        return knex('catalog').select('*').orderBy('updatedAt', 'desc');
    }


    static create(data) {
        return knex('catalog').insert(data);
    }


    static update(id, param) {
        param.updatedAt = moment().format();
        return knex('catalog').where('id', id).update(param);
    }


    static delete(id) {
        return knex('catalog').where('id', id).del();
    }


    static async getOne(param) {
        let sql = knex('catalog');

        if (param.id) {
            sql.where('id', param.id);
        }

        const catalog = await sql;
        if (catalog.length > 0) {
            return catalog[0];
        }

        return [];
    }


    static async isExist(param) {
        if (!param) {
            return false;
        }

        let sql = knex('catalog');

        if (param.id) {
            sql.where('id', param.id);
        }

        const catalog = await sql;

        if (catalog.length > 0) {
            return true;
        }

        return false;
    }

    static async countTotal(search) {
        const sql = knex('catalog').count('id as count');

        if (search) {
            sql.where('name', 'like', `%${search}%`);
        }

        const res = await sql;

        return res[0].count;
    }

    static async paging(param) {
        const sql = knex('catalog').limit(param.limit).offset(param.numberOffset);
        if (param.column && param.sort) {
            sql.orderBy(param.column, param.sort);
        }

        if (param.search) {
            sql.where('name', 'like', `%${param.search}%`);
        }

        return await sql;;
    }
}

module.exports = Catalog;
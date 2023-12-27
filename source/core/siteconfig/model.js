const knex = require('../../utils/database');
const moment = require('moment');

class SiteConfig {
    constructor() { };

    static getAll() {
        return knex('siteconfig').select('*');
    }


    static create(data) {
        return knex('siteconfig').insert(data);
    }


    static update(id, param) {
        param.updatedAt = moment().format();
        return knex('siteconfig').where('id', id).update(param);
    }


    static delete(id) {
        return knex('siteconfig').where('id', id).del();
    }


    static async getOne(param) {
        let sql = knex('siteconfig');

        if (param.id) {
            sql.where('id', param.id);
        }

        if (param.key) {
            sql.where('key', param.key);
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

        let sql = knex('siteconfig');

        if (param.id) {
            sql.where('id', param.id);
        }

        if (param.key) {
            sql.where('key', param.key);
        }

        const data = await sql;

        if (data.length > 0) {
            return true;
        }

        return false;
    }

    static async countTotal(search) {
        const sql = knex('siteconfig').count('id as count');

        if (search) {
            sql.where('name', 'like', `%${search}%`);
        }

        const res = await sql;

        return res[0].count;
    }


    static async paging(param) {
        const sql = knex('siteconfig').limit(param.limit).offset(param.numberOffset);
        if (param.column && param.sort) {
            sql.orderBy(param.column, param.sort);
        }

        if (param.search) {
            sql.where('name', 'like', `%${param.search}%`);
        }

        return await sql;;
    }
}

module.exports = SiteConfig;
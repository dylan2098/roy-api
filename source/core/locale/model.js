const knex = require('../../utils/database');
class Locale {
    constructor() { };

    static getAll() {
        return knex('locale').select('*');
    }


    static create(locale) {
        return knex('locale').insert(locale);
    }


    static update(id, param) {
        return knex('locale').where('id', id).update(param);
    }


    static delete(id) {
        return knex('locale').where('id', id).del();
    }


    static async getOne(param) {
        let sql = knex('locale');

        if (param.id) {
            sql.where('id', param.id);
        }

        const locale = await sql;
        if (locale.length > 0) {
            return locale[0];
        }

        return [];
    }


    static async isExist(param) {
        if (!param) {
            return false;
        }

        let sql = knex('locale');

        if (param.id) {
            sql.where('id', param.id);
        }

        const locale = await sql;

        if (locale.length > 0) {
            return true;
        }

        return false;
    }
}

module.exports = Locale;
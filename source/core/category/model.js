const knex = require('../../utils/database');
const moment = require('moment');
const Instance = require('../../utils/singleton');

class Category {
    constructor() { };

    static getAll() {
        return knex('category').select('*').orderBy('updatedAt', 'desc');
    }


    static create(data) {
        return knex('category').insert(data);
    }


    static update(id, param) {
        param.updatedAt = moment().format();
        return knex('category').where('id', id).update(param);
    }


    static delete(id) {
        return knex('category').where('id', id).del();
    }


    static async getOne(param) {
        let sql = knex('category');

        if (param.id) {
            sql.where('id', param.id);
        }

        const category = await sql;
        if (category.length > 0) {
            return category[0];
        }

        return [];
    }


    static async isExist(param) {
        if (!param) {
            return false;
        }

        let sql = knex('category');

        if (param.id) {
            sql.where('id', param.id);
        }

        const category = await sql;

        if (category.length > 0) {
            return true;
        }

        return false;
    }
}

module.exports = Category;
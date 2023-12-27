const knex = require('../../utils/database');
const moment = require('moment');

class RegisteredProduct {
    constructor() { };

    static getAll() {
        return knex('registered-product').select('*');
    }


    static create(data) {
        return knex('registered-product').insert(data);
    }


    static update(id, param) {
        param.updatedAt = moment().format();
        return knex('registered-product').where('id', id).update(param);
    }


    static delete(id) {
        return knex('registered-product').where('id', id).del();
    }


    static async getOne(param) {
        let sql = knex('registered-product');

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

        let sql = knex('registered-product');

        if (param.id) {
            sql.where('id', param.id);
        }

        const data = await sql;

        if (data.length > 0) {
            return true;
        }

        return false;
    }
}

module.exports = RegisteredProduct;
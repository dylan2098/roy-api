const knex = require('../../utils/database');
const moment = require('moment');
const Instance = require('../../utils/singleton');

class Cart {
    constructor() { };

    static create(data) {
        return knex('cart').insert(data);
    }

    static update(data) {
        return knex('cart').update(data).where('userId', data.userId);
    }

    static delete(id) {
        return knex('cart').where('id', id).del();
    }

    static async getOne(param) {
        let sql = knex('cart');

        if (param.userId) {
            sql.where('userId', param.userId);
        }

        const cart = await sql;
        if (cart.length > 0) {
            return cart[0];
        }

        return null;
    }


    static async isExist(param) {
        if (!param) {
            return false;
        }

        let sql = knex('cart');

        if (param.userId) {
            sql.where('userId', param.userId);
        }

        const response = await sql;

        if (response.length > 0) {
            return true;
        }

        return false;
    }
}

module.exports = Cart;
const knex = require('../../utils/database');
const moment = require('moment');
const { param } = require('express/lib/router');
const { trimmer } = require('lunr');

class Orders {
    constructor() { };

    static getAll() {
        return knex('orders').select('*');
    }


    static async create(data) {
        const result = await knex('orders').insert(data);
        if (result.length > 0) {
            return result[0];
        }

        return false;
    }


    static update(id, param) {
        param.updatedAt = moment().format();
        return knex('orders').where('id', id).update(param);
    }


    static delete(id) {
        return knex('orders').where('id', id).del();
    }


    static async getOne(param) {
        let sql = knex('orders');

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

        let sql = knex('orders');

        if (param.id) {
            sql.where('id', param.id);
        }

        const data = await sql;

        if (data.length > 0) {
            return true;
        }

        return false;
    }

    static async createOrderItem(params) {
        if (!params) {
            return false;
        }

        let sql = knex("order-item");

        if (params.productId && params.orderId && params.quantity > 0) {
            await sql.insert(params);
            return true;
        }
        return false;
    }


    static async createInvoice(params) {
        if (!params) {
            return false;
        }

        let sql = knex("invoice");
        if (params.invoiceNumber && params.orderId && params.orderNo) {
            return await sql.insert(params);
        }

        return false;
    }

    static updateInvoice(id, param) {
        return knex('invoice').where('id', id).update(param);
    }
}

module.exports = Orders;
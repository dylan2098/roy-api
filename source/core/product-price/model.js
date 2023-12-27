const knex = require('../../utils/database');
const moment = require('moment');
const Instance = require('../../utils/singleton');
class ProductPrice {
    constructor() { };

    static column = ["product-price.id as id", "productId", "pricebookId", "pricebook.currencyCode as currencyCode", "basePrice", "grossPrice", "netPrice", "tax", "note", "product-price.status as status", "pricebook.symbol as symbol"]

    static getAll() {
        return knex('product-price').select('*').orderBy('updatedAt', 'desc');
    }


    static create(data) {
        return knex('product-price').insert(data);
    }


    static update(id, param) {
        param.updatedAt = moment().format();
        return knex('product-price').where('id', id).update(param);
    }


    static delete(id) {
        return knex('product-price').where('id', id).del();
    }


    static getListPriceByProductId(productId) {
        return knex('product-price').where('productId', productId).join('pricebook', 'pricebookId', '=', 'pricebook.id').column(this.column);
    }


    static getPriceByProductIdAndLocale(productId, locale) {
        return knex('product-price').where('productId', productId)
            .join('pricebook', 'pricebookId', '=', 'pricebook.id')
            .where('pricebook.locale', locale)
            .column(this.column);
    }


    static async getOne(param) {
        let sql = knex('product-price').join('pricebook', 'pricebookId', '=', 'pricebook.id').column(this.column);

        if (param.id) {
            sql.where('product-price.id', param.id);
        }

        if (param.productId) {
            sql.where('productId', param.productId);
        }

        if (param.pricebookId) {
            sql.where('pricebookId', param.pricebookId);
        }

        const productPrice = await sql;
        if (productPrice.length > 0) {
            return productPrice[0];
        }

        return [];
    }



    static async isExist(param) {
        if (!param) {
            return false;
        }

        let sql = knex('product-price');

        if (param.id) {
            sql.where('id', param.id);
        }

        if (param.productId) {
            sql.where('productId', param.productId);
        }

        if (param.pricebookId) {
            sql.where('pricebookId', param.pricebookId);
        }

        const productPrice = await sql;
        if (productPrice.length > 0) {
            return true;
        }

        return false;
    }
}

module.exports = ProductPrice;
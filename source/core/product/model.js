const knex = require('../../utils/database');
const moment = require('moment');
const Instance = require('../../utils/singleton');
class Product {
    constructor() { };

    static column = [
        "product.id as productId",
        "product.sku as productSKU",
        "category.id as categoryId",
        "category.name as categoryName",
        "product.name as productName",
        "product.type as productType",
        "product.productMaster as productMaster",
        "product.variants as productVariants",
        "product.bundled as productBundled",
        "product.productSet as productSet",
        "product.brand as productBrand",
        "product.color as productColor",
        "product.size as productSize",
        "product.depth as productDepth",
        "product.height as productHeight",
        "product.weight as productWeight",
        "product.width as productWidth",
        "product.length as productLength",
        "product.age as productAge",
        "product.additionalAttributes as productAdditionalAttributes",
        "product.shortDesc as productShortDescription",
        "product.longDesc as productLongDescription",
        "product.manufacturerName as productManuFacturerName",
        "product.minOrderQuantity as productMinOrderQuantity",
        "product.searchableIfUnavailable as productSearchableIfUnavailable",
        "product.storeForcePriceEnabled as productStoreForcePriceEnabled",
        "product.storeNonDiscountableEnabled as productStoreNonDiscountableEnabled",
        "product.unit as productUnit",
        "product.status as productStatus",
        "product.numberOrder as productNumberOrder",
        "product.image as productImage",
        "product.images as productImages",
        "productPrice.grossPrice as grossPrice",
        "pricebook.currencyCode as currencyCode",
        "pricebook.symbol as symbol"
    ];

    static getAll(type) {
        let sql = knex('product').select('*').orderBy('updatedAt', 'desc');

        if (type) {
            sql.andWhere('type', type);
        }

        return sql;
    }


    static create(data) {
        return knex('product').insert(data);
    }


    static update(id, param) {
        param.updatedAt = moment().format();
        return knex('product').where('id', id).update(param);
    }


    static delete(id) {
        return knex('product').where('id', id).del();
    }


    static async getOne(param) {
        let sql = knex('product').join('category', 'category.id', '=', 'product.categoryId')
            .join('product-price as productPrice', 'productPrice.productId', '=', 'product.id')
            .join('pricebook', 'productPrice.pricebookId', '=', 'pricebook.id')
            .andWhere('pricebook.locale', param.locale);

        if (param.id) {
            sql.where('product.id', param.id);
        }

        if (param.type === 'master') {
            let columnGetMaster = [
                "product.id as productId",
                "product.name as productName",
                "product.type as productType",
                "product.color as productColor",
                "product.size as productSize",
                "product.brand as productBrand",
                "product.variants as productVariants",
                "productPrice.grossPrice as grossPrice",
                "pricebook.currencyCode as currencyCode",
                "pricebook.symbol as symbol"
            ];

            sql.column(columnGetMaster);
        } else {
            sql.column(this.column);
        }

        const product = await sql;
        if (product.length > 0) {
            return product[0];
        }

        return [];
    }


    static async isExist(param) {
        if (!param) {
            return false;
        }

        let sql = knex('product');

        if (param.id) {
            sql.where('id', param.id);
        }

        const product = await sql;

        if (product.length > 0) {
            return true;
        }

        return false;
    }


    static queryGetSearchGeneral(sql, param) {
        if (param.productType) {
            sql.andWhere('product.type', param.productType);
        }

        if (param.search) {
            sql.where('product.name', 'like', `%${param.search}%`);
        }

        if (param.categoryId) {
            sql.andWhere('product.categoryId', param.categoryId);
        }

        if (param.size) {
            sql.andWhere("product.size", param.size);
        }

        if (param.manuFacturer) {
            sql.where("product.manuFacturerName", 'like', `%${param.manuFacturer}%`);
        }

        if (param.brand) {
            sql.where("product.brand", 'like', `%${param.brand}%`);
        }

        if (param.isLowPrice) {
            sql.orderBy('productPrice.grossPrice', 'asc');
        }

        if (param.isHighPrice) {
            sql.orderBy('productPrice.grossPrice', 'desc');
        }

        if (param.priceRangeStart && param.priceRangeEnd) {
            sql.whereBetween('productPrice.grossPrice', [parseFloat(param.priceRangeStart), parseFloat(param.priceRangeEnd)]).orderBy('productPrice.grossPrice', 'asc');
        }

        if (param.priceRangeStart && !param.priceRangeEnd) {
            sql.where('productPrice.grossPrice', '>', parseFloat(param.priceRangeStart)).orderBy('productPrice.grossPrice', 'asc');;
        }

        if (param.priceRangeEnd && !param.priceRangeStart) {
            sql.where('productPrice.grossPrice', '<', parseFloat(param.priceRangeEnd)).orderBy('productPrice.grossPrice', 'asc');;
        }

        return sql;
    }


    static async countTotal(param) {
        const sql = knex('product').join('category', 'category.id', '=', 'product.categoryId')
            .join('product-price as productPrice', 'productPrice.productId', '=', 'product.id')
            .join('pricebook', 'productPrice.pricebookId', '=', 'pricebook.id')
            .andWhere('pricebook.locale', param.locale)
            .count('product.id as count');

        const res = await this.queryGetSearchGeneral(sql, param);
        return res[0].count;
    }


    static async paging(param) {

        const sql = knex('product')
            .join('category', 'category.id', '=', 'product.categoryId')
            .join('product-price as productPrice', 'productPrice.productId', '=', 'product.id')
            .join('pricebook', 'productPrice.pricebookId', '=', 'pricebook.id')
            .andWhere('pricebook.locale', param.locale);

        sql.column(this.column);

        if (param.limit) {
            sql.limit(param.limit);
        }

        if (param.numberOffset) {
            sql.offset(param.numberOffset);
        }

        return await this.queryGetSearchGeneral(sql, param);
    }

    // get 20 product hot or new
    static async getProductHotNew(typeGet, locale) {
        let sql = knex('product')
            .join('category', 'category.id', '=', 'product.categoryId')
            .limit(20)
            .join('product-price as productPrice', 'productPrice.productId', '=', 'product.id')
            .join('pricebook', 'productPrice.pricebookId', '=', 'pricebook.id')
            .andWhere('pricebook.locale', locale)
            .andWhere('product.type', 'master');

        sql.column(this.column);

        if (typeGet === 'hot') {
            sql.orderBy('product.numberOrder', 'desc')
        } else {
            sql.orderBy('product.id', 'desc')
        }

        return await sql;
    }


    // getProductWishList
    static getProductWishList(userId, locale) {
        return knex('product')
            .join('category', 'category.id', '=', 'product.categoryId')
            .join('wishlist', 'wishlist.productId', '=', 'product.id')
            .join('product-price as productPrice', 'productPrice.productId', '=', 'product.id')
            .join('pricebook', 'productPrice.pricebookId', '=', 'pricebook.id')
            .andWhere('pricebook.locale', locale)
            .where('wishlist.userId', userId)
            .andWhere('product.type', 'master')
            .column(this.column);
    }

}

module.exports = Product;
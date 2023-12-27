'use strict';

const e = require('express');
const express = require('express');
const router = express.Router();
const { adminAuth, customerAuth, guest } = require('../../middlewares/auth');
const Instance = require('../../utils/singleton');
const CartModel = require('./model');
const ProductModel = require('../product/model');
const ProductPriceModel = require('../product-price/model');

const Status = Instance.getInstanceStatus();
const Helper = Instance.getInstanceHelper();


router.get('/', customerAuth, async (req, res, next) => {
    if (!req.id) {
        return Status.error(res, "Data Invalid");
    }

    const userId = req.id;

    try {
        const cartUser = await CartModel.getOne({ userId });

        if (cartUser) {
            let contentCarts = JSON.parse(cartUser.contentCart);

            let products = [];

            for (let productCart of contentCarts) {
                let product = await ProductModel.getOne({ id: productCart.productId, locale: req.locale });
                product.productPrice = await ProductPriceModel.getPriceByProductIdAndLocale(product.productId, req.locale) || [];

                if (productCart.amount > 0) {
                    product.buyAmount = productCart.amount;
                    products.push(product);
                }
            }

            return Status.success(res, "Success", products);
        }

        return Status.success(res, "Sucess", []);

    } catch (error) {
        return Status.error(res, "Failed: " + error.message);
    }
})


router.put('/update-cart', customerAuth, async (req, res, next) => {
    if (!req.body.contentCart) {
        return Status.error(res, "Data Invalid");
    }

    let params = { userId: req.id };

    const dataContentCart = JSON.stringify(req.body.contentCart);
    params.contentCart = dataContentCart;
    try {
        const isExist = await CartModel.isExist(params);

        if (isExist) {
            const response = await CartModel.update(params);
            return Status.success(res, "Update success", response);
        } else {
            const response = await CartModel.create(params);
            return Status.success(res, "Create success", response);
        }

    } catch (error) {
        return Status.error(res, "Failed: " + error.message);
    }
});




module.exports = router;
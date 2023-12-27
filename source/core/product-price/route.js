'use strict';

const express = require('express');
const router = express.Router();
const { adminAuth, customerAuth, guest } = require('../../middlewares/auth');
const schema = require('./schema.json');
const validate = require('../../middlewares/validate');
const Instance = require('../../utils/singleton');
const ProductPriceModel = require('./model')


const Status = Instance.getInstanceStatus();

router.get("/", async (req, res, next) => {
    const productPrice = await ProductPriceModel.getAll();
    return Status.success(res, "Get success", productPrice);
});


router.get("/:productId", async (req, res, next) => {
    const { productId } = req.params;

    if (!productId) {
        return Status.error(res, "Data Invalid");
    }

    const productPrices = await ProductPriceModel.getListPriceByProductId(productId);

    return Status.success(res, "Get success", productPrices);
})


router.post('/', adminAuth, validate(schema), async (req, res) => {
    if (!req.body || !req.body.productId || !req.body.pricebookId) {
        return Status.error(res, "Data Invalid");
    }

    const isExist = await ProductPriceModel.isExist({ productId: req.body.productId, pricebookId: req.body.pricebookId });
    if (isExist) {
        return Status.error(res, "Data Exist");
    }

    try {

        if (req.body.basePrice) {
            req.body.basePrice = parseFloat(req.body.basePrice);
        }

        if (req.body.netPrice) {
            req.body.netPrice = parseFloat(req.body.netPrice);
        }

        if (req.body.grossPrice) {
            req.body.grossPrice = parseFloat(req.body.grossPrice);
            req.body.tax = req.body.grossPrice * 0.1;
        }


        const productPrice = await ProductPriceModel.create(req.body);
        return Status.success(res, "Create success", productPrice);
    } catch (error) {
        return Status.error(res, "Create failed: " + error.message);
    }
});


router.delete('/', adminAuth, async (req, res) => {
    if (!req.body && !req.body.id) {
        return Status.error(res, "Data Invalid");
    }

    const isExist = ProductPriceModel.isExist({ id: req.body.id });
    if (!isExist) {
        return Status.error(res, "Not found");
    }

    try {
        const data = await ProductPriceModel.delete(req.body.id);
        return Status.success(res, "Delete success", data);

    } catch (error) {
        return Status.error(res, "Delete failed: " + error.message);
    }
});



router.put('/', adminAuth, async (req, res) => {
    if (!req.body || !req.body.id || !req.body.productId || !req.body.pricebookId) {
        return Status.error(res, "Data invalid");
    }

    const isExist = ProductPriceModel.isExist({ id: req.body.id, producId: req.body.productId, pricebookId: req.body.pricebookId });
    if (!isExist) {
        return Status.error(res, "Group not found");
    }

    const id = req.body.id;

    delete req.body.id;

    try {
        await ProductPriceModel.update(id, req.body);
        const response = await ProductPriceModel.getOne({ id });
        return Status.success(res, "Update success", response);
    } catch (error) {
        return Status.error(res, "Update failed: " + error.message);
    }
})



module.exports = router;
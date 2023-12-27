'use strict';

const express = require('express');
const router = express.Router();
const CustomerAddressModel = require('./model');
const { adminAuth, customerAuth } = require('../../middlewares/auth');
const schema = require('./schema.json');
const validate = require('../../middlewares/validate');
const Instance = require('../../utils/singleton');

const Status = Instance.getInstanceStatus();
const Helper = Instance.getInstanceHelper();


router.get('/', customerAuth, async (req, res) => {
    const response = await CustomerAddressModel.getAll(req.id);
    return Status.success(res, "Get success", response);
});


router.post('/', customerAuth, validate(schema), async (req, res) => {
    if (!req.body) {
        return Status.error(res, "Data Invalid");
    }

    const params = req.body;
    params.userId = req.id;

    try {
        const customerAddress = await CustomerAddressModel.create(params);
        return Status.success(res, "Create success", customerAddress);
    } catch (error) {
        return Status.error(res, "Create data failed: " + error.message);
    }
});


router.delete('/', adminAuth, async (req, res) => {
    if (!req.body && !req.body.id) {
        return Status.error(res, "Data Invalid");
    }

    const isExist = CustomerAddressModel.isExist({ id: req.body.id });
    if (!isExist) {
        return Status.error(res, "Data not found");
    }

    try {
        const customerAddress = await CustomerAddressModel.delete(req.body.id);
        return Status.success(res, "Delete success", customerAddress);

    } catch (error) {
        return Status.error(res, "Delete failed: " + error.message);
    }
});


router.get('/selected', customerAuth, async (req, res) => {
    const addressSelected = await CustomerAddressModel.getOne({ userId: req.id, type: "find-selected" });
    return Status.success(res, "Get success", addressSelected);
});


router.put('/', customerAuth, async (req, res) => {
    if (!req.body && !req.body.id) {
        return Status.error(res, "Data invalid");
    }

    const isExist = CustomerAddressModel.isExist({ id: req.body.id });
    if (!isExist) {
        return Status.error(res, "Not Found");
    }

    const id = req.body.id;

    delete req.body.id;

    try {
        await CustomerAddressModel.update(id, req.body);
        const response = await CustomerAddressModel.getOne({ id });
        return Status.success(res, "Update success", response);
    } catch (error) {
        return Status.error(res, "Update failed: " + error.message);
    }
})

module.exports = router;
'use strict';

const express = require('express');
const router = express.Router();
const CouponModel = require('./model');
const { adminAuth, customerAuth } = require('../../middlewares/auth');
const schema = require('./schema.json');
const validate = require('../../middlewares/validate');
const Instance = require('../../utils/singleton');

const Status = Instance.getInstanceStatus();
const Helper = Instance.getInstanceHelper();


router.get('/', customerAuth, async (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 1;
    const column = req.query.column || 'id';
    const sort = req.query.sort || 'desc';
    const search = req.query.search;

    const total = await CouponModel.countTotal(search);
    const params = Helper.getParamPagination(total, limit, offset, column, sort);

    if (search) {
        params.search = search;
    }

    const data = await CouponModel.paging(params);

    const response = { showMore: params.showMore, limit: params.limit, offset: params.offset, numberPages: params.numberPages, total: total };

    return Status.success(res, "Get success", data, response);
});


router.post('/', adminAuth, validate(schema), async (req, res) => {
    if (!req.body) {
        return Status.error(res, "Data Invalid");
    }

    try {
        const coupon = await CouponModel.create(req.body);
        return Status.success(res, "Create success", coupon);
    } catch (error) {
        return Status.error(res, "Create coupon failed: " + error.message);
    }
});


router.delete('/', adminAuth, async (req, res) => {
    if (!req.body && !req.body.id) {
        return Status.error(res, "Data Invalid");
    }

    const isExist = CouponModel.isExist({ id: req.body.id });
    if (!isExist) {
        return Status.error(res, "Coupon not found");
    }

    try {
        const group = await CouponModel.delete(req.body.id);
        return Status.success(res, "Delete success", group);

    } catch (error) {
        return Status.error(res, "Delete failed: " + error.message);
    }
});


router.put('/', adminAuth, async (req, res) => {
    if (!req.body && !req.body.id) {
        return Status.error(res, "Data invalid");
    }

    const isExist = CouponModel.isExist({ id: req.body.id });
    if (!isExist) {
        return Status.error(res, "Coupon not found");
    }

    const id = req.body.id;

    delete req.body.id;

    try {
        await CouponModel.update(id, req.body);
        const response = await CouponModel.getOne({ id });
        return Status.success(res, "Update success", response);
    } catch (error) {
        return Status.error(res, "Update failed: " + error.message);
    }
})

router.put('/change-status', adminAuth, async (req, res, next) => {
    const { id } = req.body;

    if (!id) {
        return Status.error(res, "Data invalid");
    }

    const isExist = await CouponModel.isExist({ id });
    if (!isExist) {
        return Status.error(res, "Not found");
    }

    try {
        const data = await CouponModel.update(id, { status: req.body.status });

        if (data) {
            const response = await CouponModel.getOne({ id }, true);
            return Status.success(res, "Change status success", response);
        } else {
            return Status.error(res, "Something wrong");
        }

    } catch (error) {
        return Status.error(res, "Update failed: " + error.message);
    }
})

module.exports = router;
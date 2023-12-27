'use strict';

const express = require('express');
const router = express.Router();
const { adminAuth, customerAuth, guest } = require('../../middlewares/auth');
const schema = require('./schema.json');
const validate = require('../../middlewares/validate');
const Instance = require('../../utils/singleton');
const SiteConfigModel = require('./model')
const Helper = Instance.getInstanceHelper();

const Status = Instance.getInstanceStatus();

router.get("/", adminAuth, async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 1;
    const column = req.query.column || 'id';
    const sort = req.query.sort || 'desc';
    const search = req.query.search;

    const total = await SiteConfigModel.countTotal(search);
    const params = Helper.getParamPagination(total, limit, offset, column, sort);

    if (search) {
        params.search = search;
    }

    const siteConfig = await SiteConfigModel.paging(params);

    const response = { showMore: params.showMore, limit: params.limit, offset: params.offset, numberPages: params.numberPages, total: total };

    return Status.success(res, "Get data success", siteConfig, response);
});


router.post('/', adminAuth, validate(schema), async (req, res) => {
    if (!req.body) {
        return Status.error(res, "Data Invalid");
    }
    try {
        const config = await SiteConfigModel.create(req.body);
        return Status.success(res, "Create success", config);
    } catch (error) {
        return Status.error(res, "Create failed: " + error.message);
    }
});


router.delete('/', adminAuth, async (req, res) => {
    if (!req.body && !req.body.id) {
        return Status.error(res, "Data Invalid");
    }

    const isExist = SiteConfigModel.isExist({ id: req.body.id });
    if (!isExist) {
        return Status.error(res, "Not found");
    }

    try {
        const data = await SiteConfigModel.delete(req.body.id);
        return Status.success(res, "Delete success", data);

    } catch (error) {
        return Status.error(res, "Delete failed: " + error.message);
    }
});



router.put('/', adminAuth, async (req, res) => {
    if (!req.body && !req.body.id) {
        return Status.error(res, "Data invalid");
    }

    const isExist = SiteConfigModel.isExist({ id: req.body.id });
    if (!isExist) {
        return Status.error(res, "Data not found");
    }

    const id = req.body.id;

    delete req.body.id;

    try {
        await SiteConfigModel.update(id, req.body);
        const response = await SiteConfigModel.getOne({ id: id });

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

    const isExist = await SiteConfigModel.isExist({ id });
    if (!isExist) {
        return Status.error(res, "Not found");
    }

    try {
        const data = await SiteConfigModel.update(id, { status: req.body.status });

        if (data) {
            const response = await SiteConfigModel.getOne({ id }, true);
            return Status.success(res, "Change status success", response);
        } else {
            return Status.error(res, "Something wrong");
        }

    } catch (error) {
        return Status.error(res, "Update failed: " + error.message);
    }
})



module.exports = router;
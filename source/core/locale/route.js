'use strict';

const express = require('express');
const router = express.Router();
const { adminAuth, customerAuth, guest } = require('../../middlewares/auth');
const schema = require('./schema.json');
const validate = require('../../middlewares/validate');
const Instance = require('../../utils/singleton');
const LocaleModel = require('./model')


const Status = Instance.getInstanceStatus();

router.get("/", adminAuth, async (req, res, next) => {
    const locales = await LocaleModel.getAll();
    return Status.success(res, "Get locales success", locales);
});


router.post('/', adminAuth, validate(schema), async (req, res) => {
    if (!req.body) {
        return Status.error(res, "Data Invalid");
    }

    try {
        const locale = await LocaleModel.create(req.body);
        return Status.success(res, "Create success", locale);
    } catch (error) {
        return Status.error(res, "Create failed: " + error.message);
    }
});


router.delete('/', adminAuth, async (req, res) => {
    if (!req.body && !req.body.id) {
        return Status.error(res, "Data Invalid");
    }

    const isExist = LocaleModel.isExist({ id: req.body.id });
    if (!isExist) {
        return Status.error(res, "Not found");
    }

    try {
        const data = await LocaleModel.delete(req.body.id);
        return Status.success(res, "Delete success", data);

    } catch (error) {
        return Status.error(res, "Delete failed: " + error.message);
    }
});



router.put('/', adminAuth, async (req, res) => {
    if (!req.body && !req.body.id) {
        return Status.error(res, "Data invalid");
    }

    const isExist = LocaleModel.isExist({ id: req.body.id });
    if (!isExist) {
        return Status.error(res, "Group not found");
    }

    const id = req.body.id;

    delete req.body.id;

    try {
        const data = await LocaleModel.update(id, req.body);
        return Status.success(res, "Update success", data);
    } catch (error) {
        return Status.error(res, "Update failed: " + error.message);
    }
})



module.exports = router;
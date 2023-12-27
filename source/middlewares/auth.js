'use strict';

const jwt = require('jsonwebtoken');
const UserModel = require('../core/users/model');
const Instance = require('../utils/singleton');

const Status = Instance.getInstanceStatus();
const Helper = Instance.getInstanceHelper();
const Role = Instance.getInstaceRoleStatus();

const ADMIN = Role.getRoleValue("users", "admin");
const CUSTOMER = Role.getRoleValue("users", "customer");

async function authenticate(req, res, next, tokenHeaders, role) {
    if (tokenHeaders !== undefined) {
        const arr_strToken = tokenHeaders.split(" ");
        if (arr_strToken[0].toLowerCase() === 'bearer') {

            if (!arr_strToken[1])
                return Status.error(res, "Authenticate failed");

            const auth = await jwt.verify(arr_strToken[1], Helper.getSecretKey());

            if (!auth)
                return Status.error(res, "Token is expired or invalid");

            const user = await UserModel.getOne({ id: auth.userId });

            if (role) {
                if (role !== user.role && user.role !== ADMIN) {
                    return Status.error(res, "Permission deny");
                }
            }

            await jwt.sign(auth, Helper.getSecretKey());
            req.id = user.id;
            req.role = user.role;
            req.locale = user.locale;
        }
        else
            return Status.success(res, "Token failed");
    }
    else
        return Status.success(res, "Token is not defined");

    return next();
}


function adminAuth(req, res, next) {
    return authenticate(req, res, next, req.headers.authorization, ADMIN);
}


function customerAuth(req, res, next) {
    return authenticate(req, res, next, req.headers.authorization, CUSTOMER);
}


function guest(req, res, next) {
    if (req.headers.authorization && req.headers.authorization !== undefined)
        return customerAuth(req, res, next);
    return next();
}


module.exports = { adminAuth, customerAuth, guest };
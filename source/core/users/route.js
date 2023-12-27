'use strict';

const express = require('express');
const router = express.Router();
const randomstring = require('randomstring');
const UsersModel = require('./model');
const Instance = require('../../utils/singleton');
const { TemplateSignUp, TemplateResetPassword } = require("../../utils/template");

const Status = Instance.getInstanceStatus();
const Regex = Instance.getInstanceRegex();
const RoleStatus = Instance.getInstaceRoleStatus();
const JWT = Instance.getInstanceJWT();
const Helper = Instance.getInstanceHelper();
const Mail = Instance.getInstanceMail();
const Hashids = Instance.getInstanceHashids();

const validate = require('../../middlewares/validate');
const schema = require('./schema.json');
const { adminAuth, customerAuth, guest } = require('../../middlewares/auth');

router.get('/', adminAuth, async (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 1;
    const column = req.query.column || 'id';
    const sort = req.query.sort || 'desc';
    const search = req.query.search;
    const type = req.query.type.toUpperCase() || "USER";

    const total = await UsersModel.countTotal(search, type);

    const params = Helper.getParamPagination(total, limit, offset, column, sort);

    if (search) {
        params.search = search;
    }

    const users = await UsersModel.pagingUsers(params, type);

    const response = { showMore: params.showMore, limit: params.limit, offset: params.offset, numberPages: params.numberPages, total: total };

    return Status.success(res, 'Get List User System Success', users, response);
})

router.post('/', validate(schema), async (req, res) => {
    if (!req.body) {
        return Status.error(res, "Data Invalid");
    }

    if (!Regex.regexEmail(req.body.email)) {
        return Status.error(res, "Email invalid");
    }

    if (!Regex.regexPhone(req.body.phone)) {
        return Status.error(res, "Phone invalid");
    }

    if (!Regex.regexPassword(req.body.password)) {
        return Status.error(res, "Password must have at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 special character");
    }

    const data = req.body;
    const isExistMail = await UsersModel.isExist({ email: data.email });
    const isExistUsername = await UsersModel.isExist({ username: data.username });

    if (isExistMail) {
        return Status.error(res, "Email exist");
    }

    if (isExistUsername) {
        return Status.error(res, "Username exist");
    }

    data.codeActive = randomstring.generate(Helper.getGenSalt());
    data.password = await JWT.hash(data.password);

    const user = await UsersModel.create(data);
    if (user) {
        const paramSendMail = { email: req.body.email, code: data.codeActive, id: Hashids.encode(user[0]) };
        Mail.sendEmail(req.body.email, TemplateSignUp.getSubject(paramSendMail), TemplateSignUp.getText(), TemplateSignUp.getHTML(paramSendMail));
        return Status.success(res, "Created User System Success", user);
    }

    return Status.error(res, "Create Failed");
})



router.post('/login', async (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        return Status.error(res, "Username or password is not defined");
    }

    let param = {};
    if (Regex.regexEmail(req.body.username)) {
        param.email = req.body.username;
    } else {
        param.username = req.body.username;
    }

    // check find user by email
    const user = await UsersModel.getOne(param);
    if (!user) {
        return Status.error(res, "User is not exist");
    }

    // check user not active, disabled or deleted
    if (user.status !== RoleStatus.getStatusValue("users", "enabled")) {
        if (user.status === RoleStatus.getStatusValue("users", "disabled")) {
            return Status.error(res, "User has not been activated");
        } else {
            return Status.error(res, "User has been disabled");
        }
    }

    //compare password
    const isCompare = await JWT.compare(req.body.password, user.password);
    if (!isCompare) {
        return Status.error(res, "Username or password is incorrect");
    }

    // set refresh token
    const refreshToken = randomstring.generate();
    await UsersModel.update(user.id, { refreshToken });

    // format user
    const formatUser = UsersModel.format(user);

    // show refresh token & token
    formatUser.accessToken = await JWT.sign({ userId: user.id });
    formatUser.refreshToken = refreshToken;

    return Status.success(res, "Login success", formatUser);
})



router.get('/active/:id/:code/', async (req, res, next) => {
    if (req.params.id && req.params.code) {
        const code = req.params.code;
        const decodeId = Hashids.decode(req.params.id);

        if (!decodeId || decodeId.length <= 0) {
            return Status.error(res, "Active failed");
        }

        const isActive = await UsersModel.isActiveCode(decodeId[0], code);

        if (!isActive) {
            return Status.error(res, "Active failed");
        }

        try {
            const data = await UsersModel.update(decodeId[0], { status: RoleStatus.getStatusValue("users", "enabled"), codeActive: "" });
            return Status.success(res, "Active success", data);
        } catch (error) {
            return Status.error(res, "Active failed: " + error.message);
        }

    }

    return Status.error(res, "Active failed");
})


router.get('/:id', customerAuth, async (req, res, next) => {
    if (req.params.id) {

        const decodeId = Hashids.decode(req.params.id);

        if (!decodeId || decodeId.length <= 0) {
            return Status.error(res, "Account invalid");
        }

        const reqId = req.id;
        const role = req.role;

        if (role !== RoleStatus.getRoleValue("users", "admin")) {
            if (decodeId[0] !== reqId) {
                return Status.error(res, "Access denied");
            }
        }

        const id = decodeId[0];
        const user = await UsersModel.getOne({ id }, true);

        if (!user) {
            return Status.error(res, "Account not found");
        }

        return Status.success(res, "Show detail success", user);
    }
})


router.put('/change-status', adminAuth, async (req, res, next) => {
    const { id } = req.body;

    if (!id) {
        return Status.error(res, "Data invalid");
    }

    const isExistUser = await UsersModel.isExist({ id });
    if (!isExistUser) {
        return Status.error(res, "User not found");
    }

    try {
        const data = await UsersModel.update(id, { status: req.body.status });

        if (data) {
            const response = await UsersModel.getOne({ id }, true);
            return Status.success(res, "Change status success", response);
        } else {
            return Status.error(res, "Something wrong");
        }

    } catch (error) {
        return Status.error(res, "Update failed: " + error.message);
    }
})


router.delete('/', adminAuth, async (req, res, next) => {
    const { id } = req.body;

    if (!id) {
        return Status.error(res, "Data invalid");
    }

    const isExistUser = await UsersModel.isExist({ id });
    if (!isExistUser) {
        return Status.error(res, "User not found");
    }

    try {
        const data = await UsersModel.delete(id);
        return Status.success(res, "Change status success", data);
    } catch (error) {
        return Status.error(res, "Delete failed: " + error.message);
    }
})


router.put('/', customerAuth, async (req, res, next) => {
    if (!req.body) {
        return Status.error(res, "Data Invalid");
    }

    let param = req.body;

    if (param.email) {
        if (!Regex.regexEmail(param.email)) {
            return Status.error(res, "Email invalid");
        }

        const currentEmail = await UsersModel.getOne({ id: param.id });
        if (currentEmail.email !== param.email) {
            const isExistEmail = await UsersModel.isExist({ email: param.email });
            if (isExistEmail) {
                return Status.error(res, "Email exist");
            }
        }
    }

    if (param.phone) {
        if (!Regex.regexPhone(param.phone)) {
            return Status.error(res, "Phone invalid");
        }
    }


    if (param.password) {
        if (!Regex.regexPassword(param.password)) {
            return Status.error(res, "Password must have at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 special character");
        }

        param.password = await JWT.hash(param.password);
    }

    const { role } = req;

    if (param.role) {
        const CUSTOMER = RoleStatus.getRoleValue("users", "customer");
        if (role === CUSTOMER) {
            delete param.role;
        }
    }

    let idUser = null;
    if (param.id) {
        idUser = param.id;
        delete param.id;
    }

    if (param.username) {
        delete param.username;
    }

    try {
        await UsersModel.update(idUser, param);
        const response = await UsersModel.getOne({ id: idUser }, true);

        return Status.success(res, "Update success", response);
    } catch (error) {
        return Status.error(res, "Update failed: " + error.message);
    }
})



//Change password
router.put('/change-password', customerAuth, async (req, res) => {

    if (!req.body) {
        return Status.error(res, "Data Invalid");
    }

    let param = {};

    if (req.body.password && req.body.oldPassword) {
        const user = await UsersModel.getOne({ id: req.id });

        const isCompare = await JWT.compare(req.body.oldPassword, user.password);
        if (!isCompare) {
            return Status.error(res, "Password incorrect");
        }

        if (!Regex.regexPassword(req.body.password)) {
            return Status.error(res, "Password must have at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 special character");
        }

        param.password = await JWT.hash(req.body.password);
    }

    try {
        const data = await UsersModel.update(req.id, param);
        return Status.success(res, "Change Password Success", data);
    } catch (error) {
        return Status.error(res, "Change password failed: " + error.message);
    }

});


// Refresh token
router.post('/refresh', async (req, res) => {
    const accessToken = req.headers.authorization;
    const { refreshToken } = req.body;
    const arrAcesstoken = accessToken.split(' ');

    if (arrAcesstoken.length <= 1) {
        return Status.error(res, "Token invalid");
    }

    const { userId } = await JWT.verify(arrAcesstoken[1]);

    const ret = await UsersModel.isExist({ id: userId, refreshToken });
    if (ret === true) {
        const newAccessToken = await JWT.sign({ userId });
        return Status.success(res, "Create Token Success", newAccessToken)
    }

    return Status.error(res, "Refresh token failed");
});


router.post('/forgot-password', async (req, res) => {
    if (!req.body.email) {
        return Status.error(res, "Data invalid");
    }

    if (!Regex.regexEmail(req.body.email)) {
        return Status.error(res, "Email invalid");
    }


    const { email } = req.body;

    try {
        const user = await UsersModel.getOne({ email });

        if (user) {

            const paramSendMail = { email: email, password: randomstring.generate(Helper.getGenSalt()) };

            Mail.sendEmail(email, TemplateResetPassword.getSubject(), TemplateResetPassword.getText(), TemplateResetPassword.getHTML(paramSendMail));
            const password = await JWT.hash(paramSendMail.password);
            const updatePassword = await UsersModel.update(user.id, { password })

            return Status.success(res, "Change Password Success", updatePassword);
        } else {
            return Status.error(res, "Email not exist");
        }

    } catch (error) {
        return Status.error(res, "Error message: " + error.message);
    }
})



module.exports = router;
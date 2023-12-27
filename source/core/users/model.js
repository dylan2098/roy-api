const knex = require('../../utils/database');
const moment = require('moment');
const Instance = require('../../utils/singleton');
class UsersModel {

    constructor() { }

    static column = ["id", "email", "username", "firstName", "lastName", "gender", "birthday", "phone", "role", "refreshToken", "status", "optionEmail", "locale", "createdAt", "updatedAt"];

    static format(user) {
        let data = {};

        data.userId = Instance.getInstanceHashids().encode(user.id);
        data.email = user.email;
        data.username = user.username;
        data.firstName = user.firstName;
        data.lastName = user.lastName;
        data.gender = user.gender;
        data.birthday = user.birthday;
        data.phone = user.phone;
        data.role = user.role;
        data.refreshToken = user.refreshToken;
        data.status = user.status;
        data.optionEmail = user.optionEmail;
        data.locale = user.locale;
        data.createdAt = user.createdAt;
        data.updatedAt = user.updatedAt;
        data.id = user.id;

        return data;
    }


    static getAll() {
        return knex('users').orderBy('updatedAt', 'desc').column(this.column);
    }

    static async countTotal(search, type) {
        const sql = knex('users').count('id as count');

        if (search) {
            sql.where('email', 'like', `%${search}%`);
            sql.orWhere('phone', 'like', `%${search}%`);
        }

        if (type === "USER") {
            sql.where("role", Instance.getInstaceRoleStatus().getRoleValue('users', 'customer'));
        }

        if (type === "ADMIN") {
            sql.where("role", Instance.getInstaceRoleStatus().getRoleValue('users', 'admin'));
        }

        const res = await sql;

        return res[0].count;
    }


    static create(user) {
        return knex('users').insert(user);
    }



    static update(id, param) {
        param.updatedAt = moment().format();
        return knex('users').where('id', id).update(param);
    }


    static async isExist(param) {
        if (!param) {
            return false;
        }

        let sql = knex('users');

        if (param.id) {
            sql.where('id', param.id);
        }

        if (param.email) {
            sql.where('email', param.email);
        }

        if (param.username) {
            sql.where('username', param.username);
        }

        if (param.refreshToken) {
            sql.where('refreshToken', param.refreshToken);
        }

        const user = await sql;
        if (user.length > 0) {
            return true;
        }
        return false
    }



    static async getOne(param, isFormat) {
        const sql = knex('users');

        if (param.id) {
            sql.where('id', param.id);
        }

        if (param.email) {
            sql.where('email', param.email);
        }

        if (param.username) {
            sql.where('username', param.username);
        }

        const user = await sql;

        if (user.length > 0) {
            if (isFormat) {
                return this.format(user[0]);
            }

            return user[0];
        }

        return [];
    }


    static async isActiveCode(id, code) {
        const user = await knex('users').select('codeActive').where('id', id);
        if (user && user[0].codeActive === code) {
            return true;
        }
        return false;
    }

    static delete(id) {
        return knex('users').where('id', id).del();
    }

    static async pagingUsers(param, type) {
        const sql = knex('users').limit(param.limit).offset(param.numberOffset).column(this.column);
        if (param.column && param.sort) {
            sql.orderBy(param.column, param.sort);
        }

        if (type === "USER") {
            sql.where("role", Instance.getInstaceRoleStatus().getRoleValue('users', 'customer'));
        }

        if (type === "ADMIN") {
            sql.where("role", Instance.getInstaceRoleStatus().getRoleValue('users', 'admin'));
        }

        if (param.search) {
            sql.orWhere('email', 'like', `%${param.search}%`);
            sql.orWhere('phone', 'like', `%${param.search}%`);
        }

        return await sql;;
    }
}

module.exports = UsersModel;
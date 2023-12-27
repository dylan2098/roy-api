const knex = require('../../utils/database');
const moment = require('moment');
const Instance = require('../../utils/singleton');
class Group {
    constructor() { };

    static getAll() {
        return knex('group').select('*').orderBy('updatedAt', 'desc');
    }


    static create(group) {
        return knex('group').insert(group);
    }


    static update(id, param) {
        param.updatedAt = moment().format();
        return knex('group').where('id', id).update(param);
    }


    static delete(id) {
        return knex('group').where('id', id).del();
    }


    static async getOne(param) {
        let sql = knex('group');

        if (param.id) {
            sql.where('id', param.id);
        }

        const group = await sql;
        if (group.length > 0) {
            return group[0];
        }

        return [];
    }


    static async isExist(param) {
        if (!param) {
            return false;
        }

        let sql = knex('group');

        if (param.id) {
            sql.where('id', param.id);
        }

        const group = await sql;

        if (group.length > 0) {
            return true;
        }

        return false;
    }


    static getUsersOfGroup(groupId) {
        return knex('group-user').innerJoin('users', 'users.id', 'group-user.userId')
            .where('groupId', groupId)
            .where('users.status', Instance.getInstaceRoleStatus().getStatusValue('users', 'enabled'))
            .select('users.id as userId', 'groupId', 'email', 'firstName', 'lastName', 'phone', 'role', 'status')
            .orderBy('userId', 'desc');
    }


    static async isExistUserGroup(userId, groupId) {
        const userGroup = await knex('group-user').where('userId', userId).andWhere('groupId', groupId);
        if (userGroup.length > 0) {
            return true;
        }
        return false;
    }

    static deleteUserOfGroup(userId, groupId) {
        return knex('group').where('userId', userId).where('groupId', groupId).del();
    }


    static createUserOfGroup(param) {
        return knex('group-user').insert(param);
    }


    static async countTotal(search) {
        const sql = knex('group').count('id as count');

        if (search) {
            sql.where('name', 'like', `%${search}%`);
        }

        const res = await sql;

        return res[0].count;
    }


    static async paging(param) {
        const sql = knex('group').limit(param.limit).offset(param.numberOffset);
        if (param.column && param.sort) {
            sql.orderBy(param.column, param.sort);
        }

        if (param.search) {
            sql.where('name', 'like', `%${param.search}%`);
        }

        return await sql;;
    }
}

module.exports = Group;
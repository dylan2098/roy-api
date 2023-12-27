const Instance = require('./singleton.js');

const system = Instance.getInstanceHelper().getDatabaseEnvironment('mysql');

const knex = require('knex')(system);

module.exports = knex;


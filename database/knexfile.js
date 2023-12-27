module.exports = {
  development: require('../source/utils/singleton.js').getInstanceHelper().getDatabaseEnvironment('mysql')
};

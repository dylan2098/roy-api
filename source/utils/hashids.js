const Hashids = require('hashids/cjs');
const Instance = require('./singleton');

class HashIds {
    constructor() { }

    static encode(id) {
        const Helper = Instance.getInstanceHelper();
        const hashids = new Hashids(Helper.getProjectName(), Helper.getGenSalt());
        return hashids.encode(id);
    }

    static decode(hashId) {
        const Helper = Instance.getInstanceHelper();
        const hashids = new Hashids(Helper.getProjectName(), Helper.getGenSalt());
        return hashids.decode(hashId);
    }
}

module.exports = HashIds;
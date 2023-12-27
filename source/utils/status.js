
const Instance = require('./singleton');
class Status {
    constructor() { }

    static success(res, message, data = [], attachedData = {}) {
        const dataSend = { statusCode: 200, message: message, data: data };
        if (attachedData.length > 0 || Instance.getInstanceHelper().sizeObj(attachedData) > 0) {
            dataSend.attachedData = attachedData;
        }
        return res.send(dataSend);
    };

    static error(res, message, statusCode = 500) {
        return res.send({ statusCode: statusCode, message: message });
    };
}

module.exports = Status

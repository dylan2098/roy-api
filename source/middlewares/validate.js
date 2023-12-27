const ajv = require("ajv");
const Instance = require('../utils/singleton');

module.exports = schema => (req, res, next) => {
    const validator = new ajv({ allErrors: true });
    const fn_validate = validator.compile(schema);
    const is_valid = fn_validate(req.body);

    if (!is_valid)
        return Instance.getInstanceStatus().error(res, fn_validate.errors, 400)

    next();
}
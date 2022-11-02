"use strict";
exports.__esModule = true;
exports.validateWithJSONSchema = void 0;
var ajv_1 = require("ajv");
var validateWithJSONSchema = function (schema) {
    var ajv = new ajv_1["default"]();
    // see @https://github.com/sinclairzx81/typebox/issues/51
    ajv.addKeyword("units");
    ajv.addKeyword("enumeration");
    var v = ajv.compile(schema);
    return function (value) {
        var valid = v(value);
        if (valid !== true) {
            return {
                errors: v.errors,
                input: value
            };
        }
        return { value: value };
    };
};
exports.validateWithJSONSchema = validateWithJSONSchema;

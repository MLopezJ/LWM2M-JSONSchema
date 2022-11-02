"use strict";
exports.__esModule = true;
var assert = require("node:assert/strict");
var LWM2MType_1 = require("./LWM2MType");
var validateWithJsonSchema_1 = require("./src/utils/validateWithJsonSchema");
// This is a JSON representation of LwM2M, for example stored in AWS IoT Shadow
// The JSON notation for LwM2M follows previous work by AVSystem as used in Coiote, but with values follow the LwM2M standard (e.g. numbers are expressed as strings in Coiote, but are Integers in LwM2M standard)
// TODO: convert all strings to numbers where appropriate
//import stateJSON from "./known-good-shadow.json";
var _5Value = {
    Name: "Firmware Update",
    ObjectURN: "urn:oma:lwm2m:oma:5:1.1",
    LWM2MVersion: 1.1,
    ObjectVersion: 1.1,
    Resources: {
        _0: "Firmware package",
        _1: "100",
        _2: "",
        _3: 2,
        _5: 10,
        _9: 0
    }
};
var _6Value = {
    Name: "Location",
    ObjectURN: "urn:oma:lwm2m:oma:6",
    LWM2MVersion: 1.1,
    ObjectVersion: 1.1,
    Resources: {
        _0: "-43.5723",
        _1: "153.21760",
        _5: "10:25:54"
    }
};
var shadow = {
    _5: _5Value,
    _6: _6Value
};
// We can validate that the data is correctly defined as LwM2M
// TODO: define schema
var validateLwM2MJSON = (0, validateWithJsonSchema_1.validateWithJSONSchema)(LWM2MType_1.LwM2MType);
var maybeValidLwM2M = validateLwM2MJSON(shadow);
// Because is is know to be good, there must be no errors
if ("error" in maybeValidLwM2M)
    throw new Error("Validation failed");
// then we can access LwM2M objects in the shadow document
assert.deepStrictEqual("value" in maybeValidLwM2M, true);
assert.deepStrictEqual(maybeValidLwM2M.value._5.Resources._5, 10);
console.log(maybeValidLwM2M.value._5.Resources._5); // 43200, typeof number
// This ensuresure that the value is as we exect it
assert.deepStrictEqual(maybeValidLwM2M.value._5.Resources._5, 10);

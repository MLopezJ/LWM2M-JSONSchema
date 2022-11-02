import * as assert from "node:assert/strict";

import { _5 } from "./types/5";
import { _6 } from "./types/6";
import { LwM2M } from "./LWM2M";
import { LwM2MType } from "./LWM2MType";
import { validateWithJSONSchema } from "./src/utils/validateWithJsonSchema";

// This is a JSON representation of LwM2M, for example stored in AWS IoT Shadow
// The JSON notation for LwM2M follows previous work by AVSystem as used in Coiote, but with values follow the LwM2M standard (e.g. numbers are expressed as strings in Coiote, but are Integers in LwM2M standard)
// TODO: convert all strings to numbers where appropriate
//import stateJSON from "./known-good-shadow.json";

const _5Value: LwM2M.Object_5.Firmware_Update = {
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
    _9: 0,
  },
};

const _6Value: LwM2M.Object_6.Location = {
  Name: "Location",
  ObjectURN: "urn:oma:lwm2m:oma:6",
  LWM2MVersion: 1.1,
  ObjectVersion: 1.1,
  Resources: {
    _0: "-43.5723",
    _1: "153.21760",
    _5: "10:25:54",
  },
};

const shadow = {
  _5: _5Value, // Firmware_Update
  _6: _6Value, // Location
};

// We can validate that the data is correctly defined as LwM2M
// TODO: define schema
const validateLwM2MJSON = validateWithJSONSchema(LwM2MType);
const maybeValidLwM2M = validateLwM2MJSON(shadow);

// Because is is know to be good, there must be no errors
if ("error" in maybeValidLwM2M) throw new Error(`Validation failed`);

// then we can access LwM2M objects in the shadow document

assert.deepStrictEqual("value" in maybeValidLwM2M, true);
assert.deepStrictEqual((maybeValidLwM2M as any).value._5.Resources._5, 10);

console.log((maybeValidLwM2M as any).value._5.Resources._5); // 43200, typeof number

// This ensuresure that the value is as we exect it
assert.deepStrictEqual((maybeValidLwM2M as any).value._5.Resources._5, 10);

import * as assert from "node:assert/strict";
import { shadow } from "./exampleShadow";

import { LwM2MType } from "./LWM2MType";
import { validateWithJSONSchema } from "./src/utils/validateWithJsonSchema";

// validate shadow
const validateLwM2MJSON = validateWithJSONSchema(LwM2MType);
const maybeValidLwM2M = validateLwM2MJSON(shadow);

// Because is is know to be good, there must be no errors
if ("error" in maybeValidLwM2M) throw new Error(`Validation failed`);

// then we can access LwM2M objects in the shadow document
assert.deepStrictEqual("value" in maybeValidLwM2M, true);
assert.deepStrictEqual((maybeValidLwM2M as any).value._5.Resources._5, 10);

console.log((maybeValidLwM2M as any).value._5.Resources._5); // 43200, typeof number

// This ensuresure that the value is as we expect it
assert.deepStrictEqual((maybeValidLwM2M as any).value._5.Resources._5, 10);

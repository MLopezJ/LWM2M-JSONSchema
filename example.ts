import assert from "node:assert/strict";
import { validateWithJSONSchema } from "./src/utils/validateWithJsonSchema";

// This is a JSON representation of LwM2M, for example stored in AWS IoT Shadow
// The JSON notation for LwM2M follows previous work by AVSystem as used in Coiote, but with values follow the LwM2M standard (e.g. numbers are expressed as strings in Coiote, but are Integers in LwM2M standard)
// TODO: convert all strings to numbers where appropriate
import stateJSON from "./known-good-shadow.json";

// We can validate that the data is correctly defined as LwM2M
// TODO: define schema
const validateLwM2MJSON = validateWithJSONSchema(schema);
const maybeValidLwM2M = validateLwM2MJSON(stateJSON.state.reported);

// Because is is know to be good, there must be no errors
if ("error" in maybeValidLwM2M) throw new Error(`Validation failed`);

// then we can access LwM2M objects in the shadow document
maybeValidLwM2M?.["LwM2M Server"]; // typed as LwM2MServer | undefined
console.log(validateShadow?.["LwM2M Server"][0].Lifetime); // 43200, typeof number

// This ensuresure that the value is as we exect it
assert.deepStrictEqual(validateShadow?.["LwM2M Server"][0].Lifetime, 43200);

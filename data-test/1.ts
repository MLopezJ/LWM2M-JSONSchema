import { Type } from '@sinclair/typebox'
 export const LwM2M_Server = Type.Object({Short_Server_ID: Type.Number({$id: '0', description: "Used as link to associate server Object Instance.", minimum: 1, maximum: 65534})}, { additionalProperties: false }, {description: "This LwM2M Objects provides the data related to a LwM2M Server. A Bootstrap-Server has no such an Object Instance associated to it."})
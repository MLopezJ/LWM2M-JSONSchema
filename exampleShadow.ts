import { LwM2M } from "./LWM2M";

const _5: LwM2M.Object_5.Firmware_Update = {
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

const _6: LwM2M.Object_6.Location = {
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

// TODO: create shadow with real values
export const shadow = {
  _5, // Firmware_Update
  _6, // Location
};

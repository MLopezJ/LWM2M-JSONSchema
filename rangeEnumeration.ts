//About: get how many of the objects are multiple instance and how many are single instance

import path from "path";
import fs from "fs";
import { readFile, writeFile } from "fs/promises";
import { resolveUrl } from "ajv/dist/compile/resolve";

const EXTENSION = ".json";
const dirpath = path.join("./lwm2m-registry-json");

const m2mFriendly: {
  objectId: string;
  itemId: string;
  rangeEnumeration: string;
  unit: string;
}[] = [];
const notM2mFriendly: {
  objectId: string;
  itemId: string;
  rangeEnumeration: string;
  unit: string;
}[] = [];

const rangeEnumerationNotDefined: {
  objectId: string;
  itemId: string;
  rangeEnumeration: null;
  unit: string;
}[] = [];
//const notProcessedFiles: { path: string }[] = [];

/**
 * Check if registry is defined as multiple or single instance
 * @param Lwm2mRegistry
 * @returns { multiple: boolean; object: string }[]
 */
const getInfo = (Lwm2mRegistry: any): { multiple: boolean; object: string } => {
  const id: string = Lwm2mRegistry.ObjectID[0];

  const isMultiple =
    Lwm2mRegistry.MultipleInstances[0] === "Single" ? false : true;

  return { multiple: isMultiple, object: id };
};

/**
 * Read file
 * @param element
 */
const readJson = async (element: any) => {
  const fileName = element.split(".")[0];

  //  "LWM2M-v1_1", "LWM2M"
  if (!["Common", "DDF", "LWM2M_senml_units"].includes(fileName)) {
    console.log(`-- processing element ${fileName} --`);
    const jsonPath = `./lwm2m-registry-json/${fileName}.json`;
    const json = JSON.parse(await readFile(jsonPath, "utf-8"));

    const objectId = json.LWM2M.Object[0].ObjectID[0];
    json.LWM2M.Object[0].Resources[0].Item.map(
      (element: {
        ATTR: { ID: any };
        RangeEnumeration: any[];
        Units: any[];
      }) => {
        const itemId = element.ATTR.ID;
        let rangeEnumeration = element.RangeEnumeration[0];
        let unit = element.Units[0];

        rangeEnumeration =
          rangeEnumeration.trim().length === 0 ? null : rangeEnumeration;

        unit = unit.trim().length === 0 ? null : unit;

        if (rangeEnumeration !== null)
          rangeEnumeration = rangeEnumeration
            .replaceAll(/\n/g, " ")
            .replaceAll(/\r/g, " ")
            .replaceAll(/\t/g, " ");

        const object = { objectId, itemId, rangeEnumeration, unit };

        if (rangeEnumeration === null) {
          rangeEnumerationNotDefined.push(object);
          return;
        }

        // check if range is correct

        // expected format = NUMBER..NUMBER
        const check = rangeEnumeration.split(/\D/g);
        if (check > 3) notM2mFriendly.push(object);
        else m2mFriendly.push(object);

        console.log(object);
        return { object };
      }
    );
  }

  /*
  const instanceType = getInfo(json.LWM2M.Object[0]);
  instanceType.multiple
    ? multipleInstance.push(instanceType)
    : singleInstance.push(instanceType);
    */
};

/*
 */
fs.readdir(dirpath, async (err, files) => {
  for (const file of files) {
    if (path.extname(file) === EXTENSION) {
      await readJson(file);
    }
  }

  /*
  await writeFile(
    "./notProcessedFiles.ts",
    `const multiple = [${notProcessedFiles.map(
      (element) => `"${element.path}"`
    )}]`
  );
  */

  /**/
  await writeFile(
    "./rangeEnumerationNotDefined.ts",
    `const rangeEnumerationNotDefined = [${rangeEnumerationNotDefined.map(
      (element) => {
        return `{ objectId: "${element.objectId}", itemId: "${
          element.itemId
        }", rangeEnumeration: "${element.rangeEnumeration}", unit:  ${
          element.unit !== null ? `"${element.unit}"` : null
        } }`;
      }
    )}]`
  );

  await writeFile(
    "./m2mFriendly.ts",
    `const m2mFriendly = [${m2mFriendly.map((element) => {
      return `{ objectId: "${element.objectId}", itemId: "${
        element.itemId
      }", rangeEnumeration: "${element.rangeEnumeration}", unit:  ${
        element.unit !== null ? `"${element.unit}"` : null
      } }`;
    })}]`
  );
  await writeFile(
    "./notM2mFriendly.ts",
    `const notM2mFriendly = [${notM2mFriendly.map((element) => {
      return `{ objectId: "${element.objectId}", itemId: "${
        element.itemId
      }", rangeEnumeration: "${element.rangeEnumeration}", unit:  ${
        element.unit !== null ? `"${element.unit}"` : null
      } }`;
    })}]`
  );
});

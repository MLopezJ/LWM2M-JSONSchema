import { cleanUnits } from "../utils/cleanUnits";
import { dataCleaning } from "../utils/dataCleaning";
import { getMax } from "../utils/getMax";
import { getMin } from "../utils/getMin";
import { getType } from "../utils/getType";
import { getMandatoryStatus } from "./getMandatoryStatus";
import { getMultipleInstanceStatus } from "./getMultipleInstanceStatus";
import { getRangeEnumeration } from "./getRangeEnumeration";

/**
 * Generate typebox definition with received params
 * @param name
 * @param type
 * @param description
 * @param mandatoryStatus
 * @param rangeEnumeration
 * @param id
 * @param units
 * @returns string
 */
export const createResourceDefinition = (
  name: string,
  type: string,
  description: string,
  mandatoryStatus: string,
  multipleInstances: string,
  rangeEnumeration: string,
  id: string,
  units: string
): string => {
  let minimum = undefined;
  let maximum = undefined;

  const rangeEnumObject: {
    invalidFormat: boolean;
    value: string | Number | Number[] | String[] | null;
    dataStruct?: "enum" | "range" | undefined;
  } = getRangeEnumeration(rangeEnumeration);

  let desc = `${dataCleaning(description)}`;
  if (rangeEnumObject.invalidFormat === true) {
    desc = `${desc} ... ${rangeEnumObject.value}`; // TODO: improve description
  } else {
    if (rangeEnumObject.dataStruct === "range") {
      minimum = (rangeEnumObject.value as any)[0];
      maximum = (rangeEnumObject.value as any)[1];
    }
  }

  const props = [
    `title: '${name}'`,
    `description: "${desc}"`,
    minimum !== undefined ? `minimum: ${minimum}` : undefined,
    maximum !== undefined ? `maximum: ${maximum}` : undefined,
    units ? `units: '${cleanUnits(units)}'` : undefined,
  ].reduce((previous, current, index) => {
    if (current) {
      if (index === 0) return current;
      return `${previous}, ${current}`;
    }
    return previous;
  }, "");

  // TODO: improve code
  // TODO: add test cases
  let object = `Type.${getType(type)}({${props}})`;
  if (rangeEnumObject.dataStruct === "enum") {
    if (
      typeof rangeEnumObject.value === "number" ||
      typeof rangeEnumObject.value === "string"
    ) {
      const isString = isNaN(+(rangeEnumObject.value as any));
      object = isString
        ? `Type.Literal('${rangeEnumObject.value}, {${props}}')`
        : `Type.Literal(${Number(rangeEnumObject.value)}, {${props}})`;
    } else {
      // list case
      object = `Type.Union([${(rangeEnumObject.value as any).map(
        (element: string | number) => {
          const isString = isNaN(+element);
          return isString
            ? `Type.Literal('${element}')`
            : `Type.Literal(${Number(element)})`;
        }
      )}],{${props}} )`;
    }
  }

  //let object = `Type.${getType(type)}({${props}})`;
  object = getMultipleInstanceStatus(multipleInstances, object);
  object = getMandatoryStatus(mandatoryStatus, object);

  return `_${id}: ${object}`;
};

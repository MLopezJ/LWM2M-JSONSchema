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
  const rangeEnumObject: {
    invalidFormat: boolean;
    value: string | Number | Number[] | String[] | null;
    dataStruct?: "enum" | "range" | undefined;
  } = getRangeEnumeration(rangeEnumeration);

  // rules:
  // 1- if range enumeration is invalid format, the description should contain the value of range enumeration

  // 2- if range enumeration si valid and is range type, add max and min to props

  // 3- if range enumeration is valid and type is enum and single isntance, check if is string and generate literal based on that

  // 4- if range enumeration is valid and type is enum and is list, check type of every item and create definition

  let descriptionValue = `${dataCleaning(description)}`;
  if (rangeEnumObject.invalidFormat === true) {
    descriptionValue = `${descriptionValue} ... ${rangeEnumObject.value}`; // TODO: improve description
  }

  let minimum = undefined;
  let maximum = undefined;
  if (rangeEnumObject.dataStruct === "range") {
    minimum = (rangeEnumObject.value as any)[0];
    maximum = (rangeEnumObject.value as any)[1];
  }

  const props = [
    `title: '${name}'`,
    `description: "${descriptionValue}"`,
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
    object = createEnumDefinition(rangeEnumObject.value as any, props as any); // TODO: fix this
  }

  //let object = `Type.${getType(type)}({${props}})`;
  object = getMultipleInstanceStatus(multipleInstances, object);
  object = getMandatoryStatus(mandatoryStatus, object);

  return `_${id}: ${object}`;
};

/**
 *
 * @param value
 * @param props
 * @returns
 */
export const createEnumDefinition = (
  value: string | number | number[] | string[],
  props: string
) => {
  if (typeof value === "number" || typeof value === "string") {
    const isString = isNaN(+(value as any));
    return createLiteralDefinition(isString, value, props);
  } else {
    // list case
    return `Type.Union([${(value as any).map((element: string | number) => {
      return createLiteralDefinition(isNaN(+element), element, props);
    })}],{${props}})`;
  }
};

/**
 * Create custom "literal" type definition
 * @param isString
 * @param value
 * @param props
 * @returns
 */
export const createLiteralDefinition = (
  isString: boolean,
  value: string | number,
  props: string
): string =>
  isString
    ? `Type.Literal('${value}', {${props}})`
    : `Type.Literal(${value}, {${props}})`;

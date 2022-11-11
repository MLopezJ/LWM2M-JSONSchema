// TODO: add description
// TODO: Update when this issue is resolved https://github.com/OpenMobileAlliance/lwm2m-registry/issues/690
// https://github.com/OpenMobileAlliance/lwm2m-registry/pull/685

/**
 * Return true if format is invalid, false if it is valid.
 *
 * allowed formats:
 *  1- VALUE
 *  2- VALUE..VALUE
 *  3- VALUE, VALUE, VALUE
 *
 * @param element
 * @returns
 */
export const isInvalidFormat = (element: string) =>
  element.split(/[..]|,/g).some((element) => /\s/.test(element.trim()));

export const isRangeFormat = (element: string) =>
  element.split("..").length > 1;

const isSingleEnum = (element: string) =>
  element.split(/[..]|,|' '/g).length === 1;

const isListEnum = (element: string) => element.split(",").length > 1;

const isEmptyValue = (element: string) => element.trim().length === 0;

/**
 * Create an object after analyze range enumeration composition
 * @param value
 * @returns
 */
export const getRangeEnumeration = (
  value: string
): {
  invalidFormat: boolean;
  value: Number | string | Number[] | String[] | null;
  dataStruct?: "enum" | "range";
} => {
  if (isInvalidFormat(value)) return { invalidFormat: true, value: value };

  if (isEmptyValue(value)) return { invalidFormat: false, value: null };

  if (isSingleEnum(value)) {
    const enumValue = isNaN(+value) ? value : +value;
    return { invalidFormat: false, value: enumValue, dataStruct: "enum" };
  }

  if (isRangeFormat(value)) {
    const [min, max] = value.split("..");
    return { invalidFormat: false, value: [+min, +max], dataStruct: "range" };
  }

  if (isListEnum(value)) {
    const isNumberList = value.split(",").some((element) => !isNaN(+element));
    const enumList = isNumberList
      ? value.split(",").map((element) => +element)
      : value.split(",");
    return { invalidFormat: false, value: enumList, dataStruct: "enum" };
  }

  return { invalidFormat: true, value: value };
};

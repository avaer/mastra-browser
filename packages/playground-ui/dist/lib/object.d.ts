/**
 * Checks if object is empty
 * @param objectName
 * @returns boolean
 */
export declare const isObjectEmpty: (objectName: Object) => boolean;
/**
 * Get a value from an object by a given path. This function emulates the behavior of lodash's _.get method.
 *
 * @param {Record<string, any>} object - The object from which to get the value.
 * @param {string | string[]} path - The path to the value in the object. This can be a string (e.g., 'a.b.c') or an array of keys (e.g., ['a', 'b', 'c']).
 * @returns {unknown} The value at the given path in the object, or undefined if the path does not exist.
 */
export declare const getPath: (object: Record<string, any>, path: string | string[]) => unknown;
export declare function recordHasData(record: Record<any, any>): boolean;
export declare function isLiteralObject(a: unknown): boolean;
export declare const constructObjFromStringPath: (path: string, value: any) => Record<string, any>;
/**
 * Flatten a nested object, flatten from flat package works - https://www.npmjs.com/package/flat
 * but this allows you to define where you want it to stop by passing the keys that'll exist in the object you want it to stop at
 *
 * @param {Record<string, any>} object - The object to flatten.
 * @param {string[]} endKeys - The keys you want each value (which will be an object in this case) in the flattened object to possible have (e.g., ['a', 'b', 'c']).
 * @param {boolean} flattenArrayValue - This flag indicates that any array value should be flattened to object too.
 * @returns {Record<string, any>} Your flattened object
 */
export declare const flattenObject: (object: Record<string, any>, endKeys?: string[], flattenArrayValue?: boolean) => Record<string, unknown>;
type AnyObject = {
    [key: string]: any;
};
/**
 * Merges two objects, ensuring that only defined properties from the second object
 * override those in the first object.
 *
 * @template T - The type of the base object.
 * @template U - The type of the overrides object.
 * @param {T} base - The base object whose properties will be overridden.
 * @param {U} overrides - The object containing properties to override in the base object.
 *                        Only properties that are defined (not `undefined`) will override.
 * @returns {T & U} - A new object that combines properties from both `base` and `overrides`.
 *                    Properties in `base` will be overridden by defined properties in `overrides`.
 *
 * @example
 * const worksheetData = { a: 1, b: 2, c: 3 };
 * const payload = { b: undefined, c: 4 };
 * const extendedData = mergeWithDefinedOnly(worksheetData, payload);
 * // extendedData = { a: 1, b: 2, c: 4 }
 */
export declare function mergeWithDefinedOnly<T extends AnyObject, U extends AnyObject>(base: T, overrides: U): T & U;
export {};

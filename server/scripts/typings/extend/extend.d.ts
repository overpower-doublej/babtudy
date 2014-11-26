/**
     * Merge the contents of two or more objects together into the first object.
     *
     * @param target An object that will receive the new properties if additional objects are passed in or that will extend the jQuery namespace if it is the sole argument.
     * @param object1 An object containing additional properties to merge in.
     * @param objectN Additional objects containing properties to merge in.
     */
declare function extend(target: any, object1?: any, ...objectN: any[]): any;
/**
 * Merge the contents of two or more objects together into the first object.
 *
 * @param deep If true, the merge becomes recursive (aka. deep copy).
 * @param target The object to extend. It will receive the new properties.
 * @param object1 An object containing additional properties to merge in.
 * @param objectN Additional objects containing properties to merge in.
 */
declare function extend(deep: boolean, target: any, object1?: any, ...objectN: any[]): any;

declare module 'extend' {
    export = extend;
}

/*
 * @Author: Ducky Yang
 * @Date: 2021-02-05 13:31:13
 * @LastEditTime: 2021-02-05 18:13:58
 * @LastEditors: Ducky Yang
 * @Description:
 * @FilePath: \duckyorm\src\lib\decorator\ModelDefine.ts
 */

import DbType from "../enum/DbType";

/**
 * define table name. it will use class name as table name if name is empty.
 * @param name table name
 */
export function Table(name: string) {
  return function (target: any) {};
}
/**
 * define table column
 * @param name column name
 * @param type column type
 * @param primary primary key
 * @param increment auto increment, if true, this column must be primary key
 */
export function Column(
  name: string,
  nullable?: boolean,
  primary?: boolean,
  increment?: boolean
) {
  return function (target: any, propertyKey: string) {};
}
/**
 *
 * @param type set column type
 * @param size set column size
 * @param scale set column scale
 */
export function Type(type: DbType, size?: number, scale?: number) {
  return function (target: any, propertyKey: string) {};
}
/**
 * set column ignore command
 * @param ignoreSelect
 * @param ignoreInsert
 * @param ignoreUpdate
 */
export function Ignore(
  ignoreSelect: boolean,
  ignoreInsert?: boolean,
  ignoreUpdate?: boolean
) {
  return function (target: any, propertyKey: string) {};
}
/**
 * set column default value
 * @param value
 */
export function Default(value: string | number) {
  return function (target: any, propertyKey: string) {};
}
/**
 * set using current timestamp to fill column value
 */
export function UseCurrentTimestamp() {
  return function (target: any, propertyKey: string) {};
}

/*
 * @Author: Ducky Yang
 * @Date: 2021-02-05 13:31:13
 * @LastEditTime: 2021-02-09 11:23:18
 * @LastEditors: Ducky Yang
 * @Description:
 * @FilePath: \duckyorm\src\lib\Decorators.ts
 */

import { DbType } from "./Enum";
import Context from "./DuckyOrm";
import { DuckyOrmModel, DuckyOrmModelMapping } from "./DuckyOrmModel";

export interface ITypeSize {
  size: number;
  scale?: number;
}
/**
 * define table name. it will use class name as table name if name is empty.
 * @param name table name
 */
export function table(name: string) {
  return function (target: any) {
    const className = target.name;
    let model = getModel(className);

    model.tableName = name || className;
  };
}
/**
 * define table column
 * @param name column name
 * @param type column type
 * @param primary primary key
 * @param increment auto increment, if true, this column must be primary key
 */
export function column(
  name: string,
  dbType: DbType,
  size?: ITypeSize,
  nullable?: boolean
) {
  return function (target: any, propertyKey: string) {
    const className = target.constructor.name;
    let model = getModel(className);

    let mapping = getModelMapping(model, propertyKey);

    mapping.column = name;
    mapping.type = dbType;
    if ((dbType === DbType.datetime || dbType === DbType.time || dbType === DbType.timestamp) && (!size || size.size > 6)) {
      mapping.size = 6;
    } else {
      if (size) {
        mapping.size = size.size;
        mapping.scale = size.scale || 2;
      }
    }
    
    mapping.nullable = nullable || false;
  };
}
/**
 *
 * @param type set column type
 * @param size set column size
 * @param scale set column scale
 */
export function primary(primary: boolean, increment: boolean) {
  return function (target: any, propertyKey: string) {
    const className = target.constructor.name;
    let model = getModel(className);

    let mapping = getModelMapping(model, propertyKey);

    mapping.primary = primary || increment;
    mapping.increment = increment;
  };
}
/**
 * set column ignore command
 * @param ignoreSelect
 * @param ignoreInsert
 * @param ignoreUpdate
 */
export function ignore(
  ignoreSelect: boolean,
  ignoreInsert?: boolean,
  ignoreUpdate?: boolean
) {
  return function (target: any, propertyKey: string) {
    const className = target.constructor.name;
    let model = getModel(className);

    let mapping = getModelMapping(model, propertyKey);

    mapping.ignoreInsert = ignoreInsert || false;
    mapping.ignoreSelect = ignoreSelect || false;
    mapping.ignoreUpdate = ignoreUpdate || false;
  };
}
/**
 * set column default value
 * @param value
 */
export function defaultValue(value: string | number) {
  return function (target: any, propertyKey: string) {
    const className = target.constructor.name;
    let model = getModel(className);

    let mapping = getModelMapping(model, propertyKey);

    mapping.default = value || "";
  };
}
/**
 * set using current timestamp to fill column value
 */
export function useCurrentTimestamp() {
  return function (target: any, propertyKey: string) {
    const className = target.constructor.name;
    let model = getModel(className);

    let mapping = getModelMapping(model, propertyKey);

    mapping.useCurrentTimestamp = true;
  };
}

function getModel(name: string) {
  let model = Context.models.find((x) => x.className === name);
  if (!model) {
    model = new DuckyOrmModel();
    model.className = name;

    Context.models.push(model);
  }
  return model;
}
function getModelMapping(model: DuckyOrmModel, propName: string) {
  let mapping = model.mapping.find((x) => x.prop === propName);
  if (!mapping) {
    mapping = new DuckyOrmModelMapping();
    mapping.prop = propName;

    model.mapping.push(mapping);
  }
  return mapping;
}

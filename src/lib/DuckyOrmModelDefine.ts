/*
 * @Author: Ducky Yang
 * @Date: 2021-01-22 08:51:18
 * @LastEditTime: 2021-01-25 17:51:05
 * @LastEditors: Ducky Yang
 * @Description: In User Settings Edit
 * @FilePath: \FastMysqlOrm\src\lib\DuckyOrmModelDefine.ts
 */

import DbType from "./enum/DbType";

import { IDuckyOrmModelDefine } from "../types";

class DuckyOrmModelDefine implements IDuckyOrmModelDefine {
  propName: string;
  colName: string;
  dbType: DbType;
  size: number;
  scale: number;
  nullable: boolean;
  primaryKey: boolean = false;
  increment: boolean = false;
  default: string|number;
  useCurrentTimestamp: boolean;
  ignoreInsert: boolean = false;
  ignoreSelect: boolean = false;
  ignoreUpdate: boolean = false;
  constructor(
    propName: string,
    colName: string,
    dbType: DbType,
    defaultVal?: string|number,
    size?: number,
    scale?: number,
    nullable?: boolean,
    useCurrentTimestamp?: boolean
  ) {
    this.propName = propName;
    this.colName = colName;
    this.dbType = dbType || DbType.varchar;
    this.size = size || 255;
    this.scale = scale || 2;
    this.default = defaultVal || "";
    this.nullable = nullable || false;
    this.useCurrentTimestamp = useCurrentTimestamp || false;
  }
  ignore(
    ignoreSelect: boolean,
    ignoreInsert: boolean,
    ignoreUpdate: boolean
  ) {
    this.ignoreSelect = ignoreSelect || false;
    this.ignoreInsert = ignoreInsert || false;
    this.ignoreUpdate = ignoreUpdate || false;
    return this;
  }
  setPrimaryKey(primaryKey: boolean, increment: boolean) {
    this.primaryKey = primaryKey || false;
    this.increment = increment || false;
    if (increment) {
      this.primaryKey = true;
    }
    return this;
  }
}

export default DuckyOrmModelDefine;

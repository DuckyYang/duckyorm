/*
 * @Author: Ducky Yang
 * @Date: 2021-01-22 08:51:18
 * @LastEditTime: 2021-01-24 09:21:08
 * @LastEditors: Ducky
 * @Description: In User Settings Edit
 * @FilePath: /duckyorm/src/lib/FastMysqlOrmModelDefine.ts
 */

import DbType from "./DbType";

import { IFastMysqlOrmModelDefine } from "../types";

class FastMysqlOrmModelDefine implements IFastMysqlOrmModelDefine {
  propName: string;
  colName: string;
  dbType: DbType;
  size: number;
  scale: number;
  nullable: boolean;
  primaryKey: boolean = false;
  increment: boolean = false;
  default: string;
  charset: string = "utf8";
  useCurrentTimestamp: boolean;
  ignore: boolean = false;
  ignoreInsert: boolean = false;
  ignoreSelect: boolean = false;
  ignoreUpdate: boolean = false;
  constructor(
    propName: string,
    colName: string,
    dbType: DbType,
    defaultVal?: string,
    size?: number,
    nullable?: boolean,
    scale?: number,
    useCurrentTimestamp?: boolean
  ) {
    this.propName = propName;
    this.colName = colName;
    this.dbType = dbType || DbType.varchar;
    this.size = size || 255;
    this.scale = scale || 2;
    this.nullable = nullable || false;
    this.default = defaultVal || "";
    this.useCurrentTimestamp = useCurrentTimestamp || false;
  }
  setIgnore(
    ignore: boolean,
    ignoreSelect: boolean,
    ignoreInsert: boolean,
    ignoreUpdate: boolean
  ) {
    this.ignore = ignore || false;
    this.ignoreSelect = ignoreSelect || false;
    this.ignoreInsert = ignoreInsert || false;
    this.ignoreUpdate = ignoreUpdate || false;
    return this;
  }
  setPrimaryKey(primaryKey: boolean, increment: boolean) {
    this.primaryKey = primaryKey || false;
    this.increment = increment || false;
    return this;
  }
  setCharset(charset: string) {
    this.charset = charset || "utf8";
    return this;
  }
}

export default FastMysqlOrmModelDefine;

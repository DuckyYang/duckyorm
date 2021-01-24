/*
 * @Author: your name
 * @Date: 2021-01-22 08:51:18
 * @LastEditTime: 2021-01-22 15:48:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \FastMysqlOrm\FastMysqlOrmModelDefine.ts
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
  primaryKey: boolean;
  increment: boolean;
  default: string;
  charset: string;
  useCurrentTimestamp: boolean;
  ignore: boolean;
  ignoreInsert: boolean;
  ignoreSelect: boolean;
  ignoreUpdate: boolean;
  constructor(
    propName: string,
    colName: string,
    dbType: DbType,
    ignoreSelect?:boolean,
    ignoreInsert?: boolean,
    ignoreUpdate?:boolean,
    ignore?: boolean,
    defaultVal?: string,
    size?: number,
    scale?: number,
    nullable?:boolean,
    primaryKey?: boolean,
    increment?: boolean,
    charset?: string,
    useCurrentTimestamp?:boolean
  ) {
    this.propName = propName;
    this.colName = colName;
    this.dbType = dbType || DbType.varchar;
    this.size = size || 255;
    this.scale = scale || 2;
    this.nullable = nullable || false;
    this.primaryKey = primaryKey || false;
    this.increment = increment || false;
    this.default = defaultVal || "";
    this.charset = charset || "utf8";
    this.useCurrentTimestamp = useCurrentTimestamp || false;
    this.ignore = ignore || false;
    this.ignoreInsert = ignoreInsert || false;
    this.ignoreSelect = ignoreSelect || false;
    this.ignoreUpdate = ignoreUpdate || false;
  }
}

export default FastMysqlOrmModelDefine;

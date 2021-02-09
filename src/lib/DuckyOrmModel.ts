/*
 * @Author: Ducky Yang
 * @Date: 2021-02-08 17:20:10
 * @LastEditTime: 2021-02-09 14:17:56
 * @LastEditors: Ducky Yang
 * @Description:
 * @FilePath: \duckyorm\src\lib\DuckyOrmModel.ts
 */

import { IDuckyOrmModel, IDuckyOrmModelMapping } from "../types";
import { DbType } from "./Enum";

export class DuckyOrmModel implements IDuckyOrmModel {
  className: string = "";
  tableName: string = "";
  mapping: IDuckyOrmModelMapping[] = [];
  mappingDiff: IDuckyOrmModelMapping[] = [];
  ctor: any;
}

export class DuckyOrmModelMapping implements IDuckyOrmModelMapping {
  prop: string = "";
  column: string = "";
  primary: boolean = false;
  increment: boolean = false;
  nullable: boolean = false;
  type: DbType = DbType.varchar;
  size: number = 255;
  scale: number = 2;
  ignoreSelect: boolean = false;
  ignoreInsert: boolean = false;
  ignoreUpdate: boolean = false;
  default: string | number = "";
  useCurrentTimestamp: boolean = false;
}
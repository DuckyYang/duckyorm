/*
 * @Author: Ducky Yang
 * @Date: 2021-01-22 13:14:36
 * @LastEditTime: 2021-02-09 15:50:33
 * @LastEditors: Ducky Yang
 * @Description: In User Settings Edit
 * @FilePath: \duckyorm\src\types.ts
 */

import mysql from "mysql";
import { DbType, LogicType } from "./lib/Enum";
import { CommandType } from ".";

export type SqlExecutedCallBack = (sql: string, obj?: any) => void;

export interface IDuckyOrmConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  charset: string;
  timeout: number;
  aop: {
    beforeExecute: SqlExecutedCallBack;
    afterExecute: SqlExecutedCallBack;
  };
}
export interface IDuckyOrm {
  /**
   *
   */
  config: IDuckyOrmConfig;
  /**
   * mysql connection instance
   */
  connection: mysql.Connection;
  /**
   * orm define models
   */
  models: IDuckyOrmModel[];
  /**
   * connect to mysql db
   */
  connect(config: IDuckyOrmConfig): Promise<void>;
  /**
   * execute sql
   * @param sql
   * @param parameters
   */
  execute(sql: string, parameters?: Array<any>): Promise<any>;
  /**
   * define class to orm model if class use decorators
   * @param classes class
   */
  define(classes: any[]): IDuckyOrm;
  /**
   * build query command
   * @param cls class
   */
  query<T>(cls: { new (): T }): IQuery<T>;
  /**
   * build insert command
   * @param cls
   */
  insert<T>(cls: { new (): T }): IInsert<T>;
  /**
   * build update command
   * @param cls
   */
  update<T>(cls: { new (): T }): IUpdate<T>;
  /**
   * build delete command
   * @param cls
   */
  delete<T>(cls: { new (): T }): IDelete<T>;
  /**
   * build table scheme command
   * @param cls
   */
  table<T>(cls: { new (): T }): ITable<T>;
}
export interface IDuckyOrmModel {
  /**
   * class name
   */
  className: string;
  /**
   * table name
   */
  tableName: string;
  /**
   * class constructor
   */
  ctor: any;
  /**
   * property & column mapping
   */
  mapping: IDuckyOrmModelMapping[];
  /**
   * diffrent property name & column name
   */
  mappingDiff: IDuckyOrmModelMapping[];
}
export interface IDuckyOrmModelMapping {
  /**
   * model's property name
   */
  prop: string;
  /**
   * table's column name mapping to property
   */
  column: string;
  /**
   * db type
   */
  type: DbType;
  /**
   * column size, default is 255
   */
  size: number;
  /**
   * column scale for decimal, numeric, real. default is 2
   */
  scale: number;
  /**
   * column can be null or not
   */
  nullable: boolean;
  /**
   * column is primary key or not
   */
  primary: boolean;
  /**
   * column is auto increment or not.If true, primary will be true
   */
  increment: boolean;
  /**
   * column default value
   */
  default: string | number;
  /**
   * column's type is timestamp using CURRENT_TIMESTAMP
   */
  useCurrentTimestamp: boolean;
  /**
   * ignore insert command
   */
  ignoreInsert: boolean;
  /**
   * ignore select command
   */
  ignoreSelect: boolean;
  /**
   * ignore update command
   */
  ignoreUpdate: boolean;
}
export interface IDelete<T> extends IWhere {
  /**
   * exec delete command.
   */
  exec(): Promise<any>;
}
export interface IInsert<T> {
  /**
   * set inserted values
   * @param value
   */
  set(value: object | Array<object>): IInsert<T>;
  /**
   * exec to insert command
   */
  exec(): Promise<any>;
}
export interface IQuery<T> extends IWhere {
  /**
   * set query columns name. If columns is object, the object value will be used as column alias name
   * @param columns
   */
  select(columns: any | Array<string>): IQuery<T>;
  /**
   * set query order by.
   * @param order
   */
  order(order: Array<IOrderBy>): IQuery<T>;
  /**
   * query single object, if records are more than 1, it will return top 1
   */
  single(): Promise<T | null>;
  /**
   * query all records
   */
  list(): Promise<T[]>;
  /**
   * query row count
   */
  count(): Promise<number>;
  /**
   * query paged records, default pageNo is 1, default pageSize is 12;
   * @param pageNo page index default 1
   * @param pageSize page size default 12
   */
  page(pageNo: number, pageSize?: number): Promise<T[]>;
}
export interface ITable<T> {
  /**
   * create table with model defines
   */
  create(): Promise<any>;
  /**
   * drop table
   */
  drop(): Promise<any>;
  /**
   * update table scheme with model defines, it will auto compare model defines and table columns
   */
  update(): Promise<any>;
}
export interface IUpdate<T> extends IWhere {
  /**
   * set update columns and value
   * @param value eg: {name:"Ducky", age:18}
   */
  set(value: T): IUpdate<T>;
  /**
   * set columns only need to be update
   * @param value eg: {name:"Ducky", age:18}
   */
  setOnly(value:IObjectIndex): IUpdate<T>;
  /**
   * exec update command
   * Default update will not executed if not set where expression,
   */
  exec(): Promise<any>;
}
export interface IWhere {
  /**
   * set where with `AND` command
   * @param where 
   */
  where(where: IDuckyOrmWhereModel): this;
  /**
   * set where group with `AND` command
   * @param where 
   * @param logicType  point where group's logic type, default is `AND`
   */
  where(where: Array<IDuckyOrmWhereModel>, logicType?: LogicType): this;
  /**
   * set where with `AND` command
   * @param where 
   */
  and(where: IDuckyOrmWhereModel): this;
  /**
   * set where group with `AND` command
   * @param where 
   * @param logicType  point where group's logic type, default is `AND`
   */
  and(where: Array<IDuckyOrmWhereModel>, logicType?: LogicType): this;
  /**
   * set where with `OR` command
   * @param where 
   */
  or(where: IDuckyOrmWhereModel): this;
  /**
   * set where group with `OR` command
   * @param where 
   * @param logicType point where group's logic type, default is `AND`
   */
  or(where: Array<IDuckyOrmWhereModel>, logicType?: LogicType): this;
  /**
   * set where with `OR` command, but it will be with before where like `((ID=1 AND NAME='Ducky') OR MONEY=0)`
   * @param where 
   */
  andOr(where: IDuckyOrmWhereModel): this;
  /**
   * set where group with `OR` command
   * @param where 
   * @param logicType point where group's logic type, default is `AND`
   */
  andOr(where: Array<IDuckyOrmWhereModel>, logicType?: LogicType): this;
}
export interface IDuckyOrmWhereModel {
  /**
   * property name
   */
  prop: string;
  /**
   * property value
   */
  value: string | number | Array<string | number>;
  /**
   * command type
   */
  command: CommandType;
}
export interface IOrderBy {
  /**
   * class prop name
   */
  prop: string;
  type: "ASC" | "DESC";
}
export interface IObjectIndex {
  [index:string]: any;
}
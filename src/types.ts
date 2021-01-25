/*
 * @Author: Ducky Yang
 * @Date: 2021-01-22 13:14:36
 * @LastEditTime: 2021-01-25 12:28:53
 * @LastEditors: Ducky Yang
 * @Description: In User Settings Edit
 * @FilePath: /duckyorm/src/types.ts
 */

import mysql from "mysql";
import DbType from "./lib/DbType";
import { CommandType } from ".";

export type SqlExecutedCallBack = (sql: string, obj?: any) => void;

export interface IFastMysqlOrmConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  charset: string;
  timeout: number;
  errorHandler(error: string): void;
  aop: {
    beforeExecute: SqlExecutedCallBack;
    afterExecute: SqlExecutedCallBack;
  };
}

export interface IFastMysqlOrm {
  /**
   *
   */
  config: IFastMysqlOrmConfig;
  /**
   * @type {mysql.Connection}
   */
  connection: mysql.Connection;
  /**
   *
   */
  modelDefineCache: Array<IFastMysqlOrmModelDefineCache>;
  /**
   * open db connection
   */
  open(): Promise<mysql.Connection>;
  /**
   * define a model mapping to db table
   * @param modelName model name
   * @param tableName db table name
   * @param modelDefines model prop and column mapping define
   */
  defineModel(
    modelName: string,
    tableName: string,
    modelDefines: Array<IFastMysqlOrmModelDefine>
  ): IFastMysqlOrmModel;
  /**
   * get defined model by name
   * @param modelName define model name
   */
  getModel(modelName: string): IFastMysqlOrmModel | null;
}
export interface IFastMysqlOrmModelDefineCache {
  name: string;
  model: IFastMysqlOrmModel;
}

export interface IFastMysqlOrmModel {
  /**
   * table name mapping to model
   */
  tableName: string;
  /**
   * model column mapping defines
   */
  modelDefines: Array<IFastMysqlOrmModelDefine>;
  /**
   * column and property is not equal
   */
  diffPropColMapping: Array<IFastMysqlOrmModelDefine>;
  /**
   * FastMysqlOrm instance
   */
  fmo: IFastMysqlOrm;
  /**
   * reset FastMysqlOrm instance
   * @param fmo FastMysqlOrm instance
   */
  use(fmo: IFastMysqlOrm): void;
  /**
   * execute sql
   * @param sql full sql to be executed
   */
  execute(sql: string): Promise<any>;

  /**
   * execute sql with parameters
   * @param sql sql with parameters,such as 'SELECT id,name FROM `user` WHERE id=?;'
   * @param parameters parameters for placeholder `?`
   */
  executeWithParams(sql: string, parameters: Array<any>): Promise<any>;
  /**
   * build insert command to execute ,such as fmo.getModel("User").insert().setValue({name: "Ducky"}).exec();
   * It will execute sql "INSERT INTO `user` (`name`) VALUES ('Ducky')"
   */
  insert(): IInsert;
  /**
   * build delete command to execute ,such as fmo.getModel("User").delete().setWhere("id=?",[1]).exec();
   * It will execute sql "DELETE FROM `user` WHERE id=1"
   */
  delete(): IDelete;
  /**
   * build update command to execute ,such as fmo.getModel("User").update().setWhere("id=?",[1]).setColumns({name:"Ducky"}).exec();
   * It will execute sql "UPDATE `user` SET `name`='Ducky' WHERE id=1"
   */
  update(): IUpdate;
  /**
   * build query command to execute ,such as fmo.getModel("User").query().setWhere("id=?",[1]).single();
   */
  query(): IQuery;
  /**
   * build table scheme command,such as create/drop/update
   */
  table(): ITable;
}

export interface IFastMysqlOrmModelDefine {
  /**
   * model's property name
   */
  propName: string;
  /**
   * table's column name mapping to property
   */
  colName: string;
  /**
   * db type
   */
  dbType: DbType;
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
  primaryKey: boolean;
  /**
   * column is auto increment or not
   */
  increment: boolean;
  /**
   * column default value
   */
  default: string;
  /**
   * column charset, default is utf8
   */
  charset: string;
  /**
   * column's type is timestamp using CURRENT_TIMESTAMP
   */
  useCurrentTimestamp: boolean;
  /**
   * ignore all command
   */
  ignore: boolean;
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
  /**
   * set ignore commands
   * @param ignore if ignore all commands
   * @param ignoreSelect if only ignore select
   * @param ignoreInsert if only ignore insert
   * @param ignoreUpdate if only ignore update
   */
  setIgnore(
    ignore: boolean,
    ignoreSelect: boolean,
    ignoreInsert: boolean,
    ignoreUpdate: boolean
  ): IFastMysqlOrmModelDefine;
  /**
   *
   * @param primaryKey if is primary key
   * @param increment if is auto increment
   */
  setPrimaryKey(
    primaryKey: boolean,
    increment: boolean
  ): IFastMysqlOrmModelDefine;
  /**
   *
   * @param charset set column charset
   */
  setCharset(charset: string): IFastMysqlOrmModelDefine;
}

export interface IDelete {
  /**
   * set delete where expression
   * @param whereString where sql expression, such as 'id=? and name=?'
   * @param whereValues where sql parameter placeholders value
   */
  where(whereString: string, whereValues: Array<string>): IDelete;
  /**
   * exec delete command
   */
  exec(): Promise<any>;
}

export interface IInsert {
  /**
   * set single insert value
   * @param value
   */
  setValue(value: object): IInsert;
  /**
   * set multiple insert values
   * @param values
   */
  setValues(values: Array<object>): IInsert;
  /**
   * exec to insert command
   */
  exec(): Promise<any>;
}

export interface IQuery {
  /**
   * set query where expression, column must be db column,not property name
   * @param whereString where sql expression, such as 'id=? and name=?'
   * @param whereValues where sql parameter placeholders value
   */
  where(whereString: string, whereValues: Array<string>): IQuery;
  /**
   * point query columns name. If columns is object, the object value will be used as column alias name
   * @param columns
   */
  select(columns: object | Array<string>): IQuery;
  /**
   * set query order by. The parameter must be like: [["id","asc"],["timestamp","desc"]]
   * @param order
   */
  order(order: Array<Array<string>>): IQuery;
  /**
   * query single object, if records are more than 1, it will return top 1
   */
  single(): Promise<any>;
  /**
   * query all records
   */
  list(): Promise<any>;
  /**
   * query paged records, default pageNo is 1, default pageSize is 12;
   * @param pageNo page index default 1
   * @param pageSize page size default 12
   */
  page(pageNo: number, pageSize?: number): Promise<any>;
}

export interface ITable {
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

export interface IUpdate {
  /**
   * set update where expression
   * @param whereString where sql expression, such as 'id=? and name=?'
   * @param whereValues where sql parameter placeholder's value
   */
  where(whereString: string, whereValues: Array<string>): IUpdate;
  /**
   * set update columns and value
   * @param value eg: {name:"Ducky", age:18}
   */
  setColumns(value: object): IUpdate;
  /**
   * exec update command
   * Default update will not executed if not set where expression, 
   * so please set where before exec.
   */
  exec(): Promise<any>;
}

export interface IFastMysqlOrmWhere {
  /**
     * 
     * @param propName property name
     * @param value property value
     */
    where(propName: string, value:any, commandType: CommandType): IFastMysqlOrmWhere;
}
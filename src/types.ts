/*
 * @Author: Ducky Yang
 * @Date: 2021-01-22 13:14:36
 * @LastEditTime: 2021-01-25 17:51:56
 * @LastEditors: Ducky Yang
 * @Description: In User Settings Edit
 * @FilePath: \FastMysqlOrm\src\types.ts
 */

import mysql from "mysql";
import DbType from "./lib/enum/DbType";
import { CommandType } from ".";
import LogicType from "./lib/enum/LogicType";

export type SqlExecutedCallBack = (sql: string, obj?: any) => void;

export interface IDuckyOrmConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  charset: string;
  timeout: number;
  aop: {
    beforeExecute: SqlExecutedCallBack;
  };
}

export interface IDuckyOrm {
  /**
   *
   */
  config: IDuckyOrmConfig;
  /**
   * @type {mysql.Connection}
   */
  connection: mysql.Connection;
  /**
   *
   */
  modelDefineCache: Array<IDuckyOrmModelDefineCache>;
  /**
   * connect to mysql db
   */
  connect(): Promise<mysql.Connection>;
  /**
   * define a model mapping to db table
   * @param modelName model name
   * @param tableName db table name
   * @param modelDefines model prop and column mapping define
   */
  defineModel(
    modelName: string,
    tableName: string,
    modelDefines: Array<IDuckyOrmModelDefine>
  ): IDuckyOrmModel;
  /**
   * get defined model by name
   * @param modelName define model name
   */
  getModel(modelName: string): IDuckyOrmModel | null;
}
export interface IDuckyOrmModelDefineCache {
  name: string;
  model: IDuckyOrmModel;
}

export interface IDuckyOrmModel {
  /**
   * table name mapping to model
   */
  tableName: string;
  /**
   * model column mapping defines
   */
  modelDefines: Array<IDuckyOrmModelDefine>;
  /**
   * column and property is not equal
   */
  diffPropColMapping: Array<IDuckyOrmModelDefine>;
  /**
   * DuckyOrm instance
   */
  orm: IDuckyOrm;
  /**
   * reset DuckyOrm instance
   * @param fmo DuckyOrm instance
   */
  use(fmo: IDuckyOrm): void;
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

export interface IDuckyOrmModelDefine {
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
  default: string|number;
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
  /**
   * set ignore commands
   * @param ignoreSelect if only ignore select
   * @param ignoreInsert if only ignore insert
   * @param ignoreUpdate if only ignore update
   */
  ignore(
    ignoreSelect: boolean,
    ignoreInsert: boolean,
    ignoreUpdate: boolean
  ): IDuckyOrmModelDefine;
  /**
   * if increment is true, this column must be primary key
   * @param primaryKey if is primary key
   * @param increment if is auto increment
   */
  setPrimaryKey(primaryKey: boolean, increment: boolean): IDuckyOrmModelDefine;
}

export interface IDelete {
  /**
   * set where expression for query
   * @param where where model
   */
  where(where: IDuckyOrmWhereModel): IDelete;
 /**
  * fmom.Query().where([{propName:"id",value:[1,2,3], commandType: CommandType.IN}, {propName:"name",value:"Ducky", commandType: CommandType.lk}], LogicType.OR);
  * it will be "SELECT `id`, `name` FROM `user` WHERE id in (1,2,3) OR name like '%Ducky%'"
  * @param where where model array. It is 'AND' logic between array.
  * @param logicType logic type for array
  */
  where(where: Array<IDuckyOrmWhereModel>, logicType?: LogicType): IDelete;
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
   * set where expression for query
   * @param where where model
   */
  where(where: IDuckyOrmWhereModel): IQuery;
 /**
  * fmom.Query().where([{propName:"id",value:[1,2,3], commandType: CommandType.IN}, {propName:"name",value:"Ducky", commandType: CommandType.lk}], LogicType.OR);
  * it will be "SELECT `id`, `name` FROM `user` WHERE id in (1,2,3) OR name like '%Ducky%'"
  * @param where where model array. It is 'AND' logic between array.
  * @param logicType logic type for array
  */
  where(where: Array<IDuckyOrmWhereModel>, logicType?: LogicType): IQuery;
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
   * set where expression for query
   * @param where where model
   */
  where(where: IDuckyOrmWhereModel): IUpdate;
 /**
  * fmom.Query().where([{propName:"id",value:[1,2,3], commandType: CommandType.IN}, {propName:"name",value:"Ducky", commandType: CommandType.lk}], LogicType.OR);
  * it will be "SELECT `id`, `name` FROM `user` WHERE id in (1,2,3) OR name like '%Ducky%'"
  * @param where where model array. It is 'AND' logic between array.
  * @param logicType logic type for array
  */
  where(where: Array<IDuckyOrmWhereModel>, logicType?: LogicType): IUpdate;
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

export interface IDuckyOrmWhereModel {
  /**
   * property name
   */
  propName: string;
  /**
   * property value
   */
  value: string | number | Array<string | number>;
  /**
   * command type
   */
  commandType: CommandType;
}

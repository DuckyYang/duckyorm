/*
 * @Author: your name
 * @Date: 2021-01-20 13:26:36
 * @LastEditTime: 2021-01-22 19:14:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ducky.note\FastMysqlOrm\FastMysqlOrmModel.js
 */

import FastMysqlQuery from "./command/Query";
import FastMysqlInsert from "./command/Insert";
import FastMysqlUpdate from "./command/Update";
import FastMysqlDelete from "./command/Delete";
import FastMysqlTable from "./command/Table";

import {
  IFastMysqlOrmModel,
  IFastMysqlOrm,
  IFastMysqlOrmModelDefine,
  IInsert,
  IDelete,
  IUpdate,
  IQuery,
  ITable,
} from "../types";

class FastMysqlOrmModel implements IFastMysqlOrmModel {
  tableName: string;
  modelDefines: Array<IFastMysqlOrmModelDefine>;
  diffPropColMapping: Array<IFastMysqlOrmModelDefine>;
  fmo: IFastMysqlOrm;

  constructor(
    fmo: IFastMysqlOrm,
    tableName: string,
    modelDefines: Array<IFastMysqlOrmModelDefine>
  ) {
    this.fmo = fmo;
    this.tableName = tableName;
    this.modelDefines = modelDefines;
    this.diffPropColMapping = modelDefines.filter(
      (x) => x.propName !== x.colName
    );
  }
  /**
   *
   * @param fmo
   */
  use(fmo: IFastMysqlOrm) {
    this.fmo = fmo;
  }

  /**
   *
   * @param {*} sql
   */
  execute(sql: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.fmo.connection) {
        reject(
          "mysql.Connection is not inititalized,please call FastMysqlOrm.open to init"
        );
        return;
      }
      sql = this.fmo.connection.format(sql, []);
      this.fmo.config.aop.beforeExecute(sql);
      this.fmo.connection.query(sql, (err, results, fields) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }
  /**
   * execute sql with parameters
   * @param sql sql with parameters,such as 'SELECT id,name FROM `user` WHERE id=?;'
   * @param parameters parameters for placeholder `?`
   */
  executeWithParams(sql: string, parameters: Array<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.fmo.connection) {
        reject(
          "mysql.Connection is not inititalized,please call FastMysqlOrm.open to init"
        );
        return;
      }
      const safeSql = this.fmo.connection.format(sql, parameters);
      this.fmo.config.aop.beforeExecute(safeSql, { sql: sql, values: parameters });
      this.fmo.connection.query(safeSql, (err, results, fields) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }
  /**
   * build insert command to execute ,such as fmo.getModel("User").insert().setValue({name: "Ducky"}).exec();
   * It will execute sql "INSERT INTO `user` (`name`) VALUES ('Ducky')"
   */
  insert(): IInsert {
    return new FastMysqlInsert(this);
  }
  /**
   * build delete command to execute ,such as fmo.getModel("User").delete().setWhere("id=?",[1]).exec();
   * It will execute sql "DELETE FROM `user` WHERE id=1"
   */
  delete(): IDelete {
    return new FastMysqlDelete(this);
  }
  /**
   * build update command to execute ,such as fmo.getModel("User").update().setWhere("id=?",[1]).setColumns({name:"Ducky"}).exec();
   * It will execute sql "UPDATE `user` SET `name`='Ducky' WHERE id=1"
   */
  update(): IUpdate {
    return new FastMysqlUpdate(this);
  }
  /**
   * build query command to execute ,such as fmo.getModel("User").update().setWhere("id=?",[1]).single();
   */
  query(): IQuery {
    return new FastMysqlQuery(this);
  }
  /**
   * build table scheme command,such as create/drop/update
   */
  table(): ITable {
    return new FastMysqlTable(this);
  }
}

export default FastMysqlOrmModel;

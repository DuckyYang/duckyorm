/*
 * @Author: Ducky Yang
 * @Date: 2021-01-20 13:26:36
 * @LastEditTime: 2021-01-25 17:46:34
 * @LastEditors: Ducky Yang
 * @Description: In User Settings Edit
 * @FilePath: \FastMysqlOrm\src\lib\model\DuckyOrmModel.ts
 */

import DuckyOrmQuery from "../command/Query";
import DuckyOrmInsert from "../command/Insert";
import DuckyOrmUpdate from "../command/Update";
import DuckyOrmDelete from "../command/Delete";
import DuckyOrmTable from "../command/Table";

import {
  IDuckyOrmModel,
  IDuckyOrm,
  IDuckyOrmModelDefine,
  IInsert,
  IDelete,
  IUpdate,
  IQuery,
  ITable,
} from "../../types";
import DuckyOrmError from "../DuckyOrmError";

class DuckyOrmModel implements IDuckyOrmModel {
  tableName: string;
  modelDefines: Array<IDuckyOrmModelDefine>;
  diffPropColMapping: Array<IDuckyOrmModelDefine>;
  orm: IDuckyOrm;

  constructor(
    orm: IDuckyOrm,
    tableName: string,
    modelDefines: Array<IDuckyOrmModelDefine>
  ) {
    this.orm = orm;
    this.tableName = tableName;
    this.modelDefines = modelDefines;
    this.diffPropColMapping = modelDefines.filter(
      (x) => x.propName !== x.colName
    );
  }
  /**
   *
   * @param orm
   */
  use(orm: IDuckyOrm) {
    this.orm = orm;
  }

  /**
   *
   * @param {*} sql
   */
  execute(sql: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.orm.connection) {
        throw new DuckyOrmError( "mysql is not connected,please call DuckyOrm'connect method to connect");
      }
      sql = this.orm.connection.format(sql, []);
      this.orm.config.aop.beforeExecute(sql);
      this.orm.connection.query(sql, (err, results, fields) => {
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
      if (!this.orm.connection) {
        throw new DuckyOrmError( "mysql is not connected,please call DuckyOrm'connect method to connect");
      }
      const safeSql = this.orm.connection.format(sql, parameters);
      this.orm.config.aop.beforeExecute(safeSql, { sql: sql, values: parameters });
      this.orm.connection.query(safeSql, (err, results, fields) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }
  /**
   * build insert command to execute ,such as orm.getModel("User").insert().setValue({name: "Ducky"}).exec();
   * It will execute sql "INSERT INTO `user` (`name`) VALUES ('Ducky')"
   */
  insert(): IInsert {
    return new DuckyOrmInsert(this);
  }
  /**
   * build delete command to execute ,such as orm.getModel("User").delete().setWhere("id=?",[1]).exec();
   * It will execute sql "DELETE FROM `user` WHERE id=1"
   */
  delete(): IDelete {
    return new DuckyOrmDelete(this);
  }
  /**
   * build update command to execute ,such as orm.getModel("User").update().setWhere("id=?",[1]).setColumns({name:"Ducky"}).exec();
   * It will execute sql "UPDATE `user` SET `name`='Ducky' WHERE id=1"
   */
  update(): IUpdate {
    return new DuckyOrmUpdate(this);
  }
  /**
   * build query command to execute ,such as orm.getModel("User").update().setWhere("id=?",[1]).single();
   */
  query(): IQuery {
    return new DuckyOrmQuery(this);
  }
  /**
   * build table scheme command,such as create/drop/update
   */
  table(): ITable {
    return new DuckyOrmTable(this);
  }
}

export default DuckyOrmModel;

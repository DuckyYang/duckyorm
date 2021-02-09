/*
 * @Author: Ducky Yang
 * @Date: 2021-01-19 09:56:09
 * @LastEditTime: 2021-02-09 13:04:29
 * @LastEditors: Ducky Yang
 * @Description: In User Settings Edit
 * @FilePath: \duckyorm\src\lib\DuckyOrm.ts
 */

import mysql from "mysql";
import {
  IDuckyOrmModel,
  IDuckyOrm,
  IDuckyOrmConfig,
  IQuery,
  IInsert,
  IUpdate,
  IDelete,
  ITable,
} from "../types";
import DuckyOrmDelete from "./command/Delete";
import DuckyOrmInsert from "./command/Insert";
import DuckyOrmQuery from "./command/Query";
import DuckyOrmTable from "./command/Table";
import DuckyOrmUpdate from "./command/Update";
import DuckyOrmError from "./DuckyOrmError";

class DuckyOrm implements IDuckyOrm {
  config!: IDuckyOrmConfig;
  /**
   * @type {mysql.Connection}
   */
  connection!: mysql.Connection;

  models: IDuckyOrmModel[] = [];

  constructor() {}
  /**
   * connect to database
   * @param config db configuration
   */
  connect(config: IDuckyOrmConfig) {
    return new Promise<void>((resolve, reject) => {
      try {
        if (!config) {
          throw new DuckyOrmError("DuckyOrm need config to connect");
        }
        this.config = config;
        const connection = mysql.createConnection({
          host: this.config.host,
          port: this.config.port,
          user: this.config.user,
          password: this.config.password,
          charset: this.config.charset,
          timeout: this.config.timeout,
          dateStrings: true,
          database: this.config.database,
        });
        this.connection = connection;
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
  /**
   * registe all models defined
   * @param {any[]} classes
   */
  define(classes: any[]): IDuckyOrm {
    classes.forEach((cls) => {
      const className = cls.name;
      let model = this.models.find((x) => x.className === className);
      if (model) {
        model.ctor = cls;
        model.mappingDiff = model.mapping.filter((x) => x.prop !== x.column);
      }
    });
    return this;
  }
  get<T>(cls: { new (): T }): IDuckyOrmModel | undefined {
    return this.models.find((x) => x.className === cls.name);
  }

  query<T>(cls: { new (): T }): IQuery<T> {
    const model = this.get<T>(cls);
    if (model) {
      return new DuckyOrmQuery<T>(model);
    }
    throw new DuckyOrmError(`${cls.name} is not defined`);
  }

  insert<T>(cls: { new (): T }): IInsert<T> {
    const model = this.get<T>(cls);
    if (model) {
      return new DuckyOrmInsert<T>(model);
    }
    throw new DuckyOrmError(`${cls.name} is not defined`);
  }

  update<T>(cls: { new (): T }): IUpdate<T> {
    const model = this.get<T>(cls);
    if (model) {
      return new DuckyOrmUpdate<T>(model);
    }
    throw new DuckyOrmError(`${cls.name} is not defined`);
  }

  delete<T>(cls: { new (): T }): IDelete<T> {
    const model = this.get<T>(cls);
    if (model) {
      return new DuckyOrmDelete<T>(model);
    }
    throw new DuckyOrmError(`${cls.name} is not defined`);
  }

  table<T>(cls: { new (): T }): ITable<T> {
    const model = this.get<T>(cls);
    if (model) {
      return new DuckyOrmTable<T>(model);
    }
    throw new DuckyOrmError(`${cls.name} is not defined`);
  }
  /**
   *
   * @param {*} sql
   */
  execute(sql: string, parameters?: Array<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.connection) {
        throw new DuckyOrmError(
          "mysql is not connected,please call DuckyOrm'connect method to connect"
        );
      }
      if (!parameters) {
        parameters = [];
      }
      const safeSql = this.connection.format(sql, parameters);
      this.config.aop.beforeExecute(safeSql, { sql: sql, values: parameters });
      this.connection.query(safeSql, (err, results, fields) => {
        this.config.aop.afterExecute(safeSql, {
          sql: sql,
          values: parameters,
          results: results,
          fields: fields,
        });
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }
}

const Context = new DuckyOrm();

export default Context;

/*
 * @Author: Ducky Yang
 * @Date: 2021-01-19 09:56:09
 * @LastEditTime: 2021-01-24 09:21:54
 * @LastEditors: Ducky
 * @Description: In User Settings Edit
 * @FilePath: /duckyorm/src/lib/FastMysqlOrm.ts
 */

import mysql from "mysql";
import {
  IFastMysqlOrmModel,
  IFastMysqlOrmModelDefineCache,
  IFastMysqlOrm,
  IFastMysqlOrmConfig,
  IFastMysqlOrmModelDefine,
} from "../types";
import FastMysqlOrmModel from "./FastMysqlOrmModel";

class FastMysqlOrmModelDefineCache implements IFastMysqlOrmModelDefineCache {
  name: string;
  model: IFastMysqlOrmModel;
  constructor(name: string, model: IFastMysqlOrmModel) {
    this.name = name;
    this.model = model;
  }
}

class FastMysqlOrm implements IFastMysqlOrm {
  
  config: IFastMysqlOrmConfig;
  /**
   * @type {mysql.Connection}
   */
  connection!: mysql.Connection;
  /**
   *
   */
  modelDefineCache: Array<IFastMysqlOrmModelDefineCache> = [];

  constructor(config: IFastMysqlOrmConfig) {
    if (!config) {
      throw new Error("FastMysql need config to initialize");
    }
    this.config = config;
  }
  open() {
    return new Promise<mysql.Connection>((resolve, reject) => {
      try {
        const connection = mysql.createConnection({
          host: this.config.host,
          port: this.config.port,
          user: this.config.username,
          password: this.config.password,
          charset: this.config.charset,
          timeout: this.config.timeout,
          dateStrings: true,
          database: this.config.database,
        });
        this.connection = connection;
        resolve(connection);
      } catch (error) {
        reject(error);
      }
    });
  }
  /**
   *
   * @param {*} modelName
   * @param {*} tableName
   * @param {*} modelDefines
   */
  defineModel(
    modelName: string,
    tableName: string,
    modelDefines: Array<IFastMysqlOrmModelDefine>
  ) {
    let modelCache = this.modelDefineCache.find((x) => x.name === modelName);
    if (!modelCache) {
      const model: IFastMysqlOrmModel = new FastMysqlOrmModel(
        this,
        tableName,
        modelDefines
      );
      modelCache = new FastMysqlOrmModelDefineCache(modelName, model);
      this.modelDefineCache.push(modelCache);
    }
    return modelCache.model;
  }
  /**
   *
   * @param {*} modelName
   */
  getModel(modelName: string): IFastMysqlOrmModel | null {
    var cache = this.modelDefineCache.find((x) => x.name === modelName);
    if (cache) {
      return cache.model;
    }
    return null;
  }
}

export default FastMysqlOrm;

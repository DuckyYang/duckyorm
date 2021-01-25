/*
 * @Author: Ducky Yang
 * @Date: 2021-01-19 09:56:09
 * @LastEditTime: 2021-01-25 17:47:25
 * @LastEditors: Ducky Yang
 * @Description: In User Settings Edit
 * @FilePath: \FastMysqlOrm\src\lib\DuckyOrm.ts
 */

import mysql from "mysql";
import {
  IDuckyOrmModel,
  IDuckyOrmModelDefineCache,
  IDuckyOrm,
  IDuckyOrmConfig,
  IDuckyOrmModelDefine,
} from "../types";
import DuckyOrmError from "./DuckyOrmError";
import DuckyOrmModel from "./model/DuckyOrmModel";

class DuckyOrmModelDefineCache implements IDuckyOrmModelDefineCache {
  name: string;
  model: IDuckyOrmModel;
  constructor(name: string, model: IDuckyOrmModel) {
    this.name = name;
    this.model = model;
  }
}

class DuckyOrm implements IDuckyOrm {
  
  config: IDuckyOrmConfig;
  /**
   * @type {mysql.Connection}
   */
  connection!: mysql.Connection;
  /**
   *
   */
  modelDefineCache: Array<IDuckyOrmModelDefineCache> = [];

  constructor(config: IDuckyOrmConfig) {
    if (!config) {
      throw new DuckyOrmError("DuckyOrm need config to connect");
    }
    this.config = config;
  }
  connect() {
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
    modelDefines: Array<IDuckyOrmModelDefine>
  ) {
    let modelCache = this.modelDefineCache.find((x) => x.name === modelName);
    if (!modelCache) {
      const model: IDuckyOrmModel = new DuckyOrmModel(
        this,
        tableName,
        modelDefines
      );
      modelCache = new DuckyOrmModelDefineCache(modelName, model);
      this.modelDefineCache.push(modelCache);
    }
    return modelCache.model;
  }
  /**
   *
   * @param {*} modelName
   */
  getModel(modelName: string): IDuckyOrmModel | null {
    var cache = this.modelDefineCache.find((x) => x.name === modelName);
    if (cache) {
      return cache.model;
    }
    return null;
  }
}

export default DuckyOrm;

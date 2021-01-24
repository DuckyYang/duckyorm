/*
 * @Author: your name
 * @Date: 2021-01-22 09:10:34
 * @LastEditTime: 2021-01-22 19:10:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \FastMysqlOrm\FastMysqlOrmConfig.ts
 */

import { IFastMysqlOrmConfig, SqlExecutedCallBack } from "../types";

class FastMysqlOrmConfig implements IFastMysqlOrmConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  charset: string;
  timeout: number;
  aop: {
    beforeExecute: SqlExecutedCallBack;
    afterExecute: SqlExecutedCallBack;
  };
  errorHandler: (error: string) => void;
  constructor(
    host: string,
    port: number,
    username: string,
    password: string,
    database: string,
    charset?: string,
    timeout?: number
  ) {
    this.host = host || "localhost";
    this.port = port || 3306;
    this.username = username;
    this.password = password;
    this.database = database;
    this.charset = charset || "utf8";
    this.timeout = timeout || 15000;
    this.errorHandler = (error: string) => {};
    this.aop = {
      beforeExecute() {},
      afterExecute() {},
    };
  }
}

export default FastMysqlOrmConfig;

/*
 * @Author: Ducky Yang
 * @Date: 2021-01-22 09:10:34
 * @LastEditTime: 2021-02-09 10:38:30
 * @LastEditors: Ducky Yang
 * @Description: In User Settings Edit
 * @FilePath: \duckyorm\src\lib\DuckyOrmConfig.ts
 */

import { IDuckyOrmConfig, SqlExecutedCallBack } from "../types";

class DuckyOrmConfig implements IDuckyOrmConfig {
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
  constructor(
    host: string,
    port: number,
    user: string,
    password: string,
    database: string,
    charset?: string,
    timeout?: number
  ) {
    this.host = host || "localhost";
    this.port = port || 3306;
    this.user = user;
    this.password = password;
    this.database = database;
    this.charset = charset || "utf8";
    this.timeout = timeout || 15000;
    this.aop = {
      beforeExecute() {},
      afterExecute() {},
    };
  }
}

export default DuckyOrmConfig;

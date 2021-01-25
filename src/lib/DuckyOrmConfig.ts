/*
 * @Author: Ducky Yang
 * @Date: 2021-01-22 09:10:34
 * @LastEditTime: 2021-01-25 17:52:15
 * @LastEditors: Ducky Yang
 * @Description: In User Settings Edit
 * @FilePath: \FastMysqlOrm\src\lib\DuckyOrmConfig.ts
 */

import {
  IDuckyOrmConfig,
  SqlExecutedCallBack,
} from "../types";

class DuckyOrmConfig implements IDuckyOrmConfig {
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
    this.aop = {
      beforeExecute() {}
    };
  }
}

export default DuckyOrmConfig;

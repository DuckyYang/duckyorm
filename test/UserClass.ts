/*
 * @Author: Ducky Yang
 * @Date: 2021-02-09 10:47:53
 * @LastEditTime: 2021-02-09 16:26:38
 * @LastEditors: Ducky Yang
 * @Description:
 * @FilePath: \duckyorm\test\UserClass.ts
 */

import { column, DbType, ignore, table, primary, useCurrentTimestamp } from "../src";

@table("user")
export default class UserClass {
  @column("id", DbType.int, { size: 8 }, false)
  @primary(true, true)
  id: string = "";
  @column("name", DbType.varchar)
  name: string = "";
  @column("money", DbType.decimal, { size: 8, scale: 2 })
  money: number = 0;
  @column("password", DbType.varchar, { size: 20 })
  @ignore(true)
  password: string = "";
  @column("insert_time", DbType.datetime)
  @useCurrentTimestamp()
  @ignore(false, true)
  insertTime: string = "";
}

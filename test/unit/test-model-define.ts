/*
 * @Author: Ducky Yang
 * @Date: 2021-01-25 14:30:15
 * @LastEditTime: 2021-01-25 15:55:58
 * @LastEditors: Ducky Yang
 * @Description:
 * @FilePath: \FastMysqlOrm\test\unit\test-model-define.ts
 */

import { DbType, DuckyOrmModelDefine } from "../../src";
import orm from "../util";

export default async () => {
  orm.defineModel("UserModel", "user", [
    new DuckyOrmModelDefine("id", "id", DbType.int, 0, 8).setPrimaryKey(
      true,
      true
    ),
    new DuckyOrmModelDefine("name", "name", DbType.varchar, "", 20),
    new DuckyOrmModelDefine(
      "money",
      "money",
      DbType.decimal,
      0,
      8,
      2, 
      false,
    ),
    new DuckyOrmModelDefine("enabled", "enabled", DbType.tinyint, 1, 1),
    new DuckyOrmModelDefine(
      "mobile",
      "mobile_phone",
      DbType.varchar,
      "",
      18
    ),
  ]);
};

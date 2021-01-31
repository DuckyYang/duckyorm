/*
 * @Author: Ducky Yang
 * @Date: 2021-01-25 14:30:15
 * @LastEditTime: 2021-01-31 11:39:11
 * @LastEditors: Ducky Yang
 * @Description:
 * @FilePath: /duckyorm/test/unit/test-model-define.ts
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
    new DuckyOrmModelDefine("status", "status", DbType.tinyint, 1, 1),
    new DuckyOrmModelDefine(
      "email",
      "email",
      DbType.varchar,
      "",
      18
    ),
    new DuckyOrmModelDefine(
      "password",
      "password",
      DbType.varchar,
      "",
      18
    ),
  ]);
};

/*
 * @Author: Ducky Yang
 * @Date: 2021-01-25 14:12:43
 * @LastEditTime: 2021-01-25 17:55:48
 * @LastEditors: Ducky Yang
 * @Description:
 * @FilePath: \FastMysqlOrm\test\run.ts
 */

import testModelDefine from "./unit/test-model-define";
import testDropTable from "./unit/test-drop-table";
import testCreateTable from "./unit/test-create-table";
import testInsert from "./unit/test-insert";
import testDelete from "./unit/test-delete";
import testQuery from "./unit/test-query";

import orm from "./util";

(async () => {
  await orm.connect();
  await testModelDefine();

  await testDropTable();

  await testCreateTable();

  await testInsert();

  await testDelete();

  await testQuery();
})();

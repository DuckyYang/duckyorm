/*
 * @Author: Ducky Yang
 * @Date: 2021-01-25 14:13:59
 * @LastEditTime: 2021-01-25 18:03:00
 * @LastEditors: Ducky Yang
 * @Description:
 * @FilePath: \FastMysqlOrm\test\unit\test-create-table.ts
 */

import orm from "../util";

export default async () =>{
    await orm.getModel("UserModel")?.table().create();
}
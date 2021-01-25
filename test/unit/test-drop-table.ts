/*
 * @Author: Ducky Yang
 * @Date: 2021-01-25 16:04:50
 * @LastEditTime: 2021-01-25 16:04:58
 * @LastEditors: Ducky Yang
 * @Description: 
 * @FilePath: \FastMysqlOrm\test\unit\test-drop-table.ts
 */
import orm from "../util";

export default async () =>{
    await orm.getModel("UserModel")?.table().drop();
}
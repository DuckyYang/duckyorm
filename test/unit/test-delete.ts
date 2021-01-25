/*
 * @Author: Ducky Yang
 * @Date: 2021-01-25 16:10:22
 * @LastEditTime: 2021-01-25 16:11:52
 * @LastEditors: Ducky Yang
 * @Description: 
 * @FilePath: \FastMysqlOrm\test\unit\test-delete.ts
 */
import { CommandType } from "../../src";
import DuckyOrmWhereModel from "../../src/lib/model/DuckyOrmWhereModel";
import orm from "../util";
 
export default async ()=>{
    await orm.getModel("UserModel")?.delete().where(new DuckyOrmWhereModel("id",500, CommandType.gt)).exec();
};
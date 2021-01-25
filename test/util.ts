/*
 * @Author: Ducky Yang
 * @Date: 2021-01-25 14:25:14
 * @LastEditTime: 2021-01-25 15:31:33
 * @LastEditors: Ducky Yang
 * @Description: 
 * @FilePath: \FastMysqlOrm\test\common.ts
 */

import { DuckyOrm, DuckyOrmConfig } from "../src/index";

const config = new DuckyOrmConfig("localhost",3306, "root", "yanglixu", "orm_test");
config.aop.beforeExecute = (sql)=>{
    console.log(sql);
}
const orm = new DuckyOrm(config);

export default orm;
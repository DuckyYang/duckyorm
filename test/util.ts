/*
 * @Author: Ducky Yang
 * @Date: 2021-01-25 14:25:14
 * @LastEditTime: 2021-01-31 10:14:31
 * @LastEditors: Ducky Yang
 * @Description: 
 * @FilePath: /duckyorm/test/util.ts
 */

import { DuckyOrm, DuckyOrmConfig } from "../src/index";

const config = new DuckyOrmConfig("localhost",3306, "root", "yanglixu", "note");
config.aop.beforeExecute = (sql)=>{
    console.log(sql);
}
const orm = new DuckyOrm(config);

export default orm;
/*
 * @Author: Ducky Yang
 * @Date: 2021-01-25 14:12:43
 * @LastEditTime: 2021-02-09 16:39:51
 * @LastEditors: Ducky Yang
 * @Description:
 * @FilePath: \duckyorm\test\run.ts
 */

import { CommandType, DuckyOrm, DuckyOrmConfig, LogicType } from "../src";
import UserClass from "./UserClass";

(async () => {
  const config = new DuckyOrmConfig(
    "localhost",
    3306,
    "root",
    "password",
    "orm_test"
  );

  config.aop.afterExecute = (sql, obj) => {
    console.log(sql);
    console.log(obj);
  };

  await DuckyOrm.connect(config);

  DuckyOrm.define([UserClass]);

  DuckyOrm.table(UserClass).drop();

  DuckyOrm.table(UserClass).create();

  let arr = [];
  for (let index = 0; index < 10000; index++) {
      let user = new UserClass();
      user.name = "name"+index;
      user.money = index* 100;
      user.password = "pwd"+index*2;
      arr.push(user);
  }

  await DuckyOrm.insert(UserClass).set(arr).exec();

  await DuckyOrm.delete(UserClass).where({prop:"name", value:"%2%", command: CommandType.lk}).exec();

  const list1 = await DuckyOrm.query(UserClass).where({prop:"name", value:"%10%",command: CommandType.lk}).list();

  const list2 = await DuckyOrm.query(UserClass).where([
    {prop:"name", value:"%10%",command: CommandType.lk},
    {prop:"money", value:"2000",command: CommandType.lt}
  ],LogicType.OR).where([
    {prop:"id", value:"50",command: CommandType.gt}
  ]).list();

  const list3 = await DuckyOrm.query(UserClass).where([
    {prop:"name", value:"%10%",command: CommandType.lk},
    {prop:"money", value:"2000",command: CommandType.lt}
  ],LogicType.AND).or([
    {prop:"id", value:"50",command: CommandType.gt}
  ]).list();

  const list4 = await DuckyOrm.query(UserClass).where({
    prop:"id",value:[100,500],command:CommandType.bet
  }).list();

  const list5 = await DuckyOrm.query(UserClass)
    .where({
      prop: "id",
      value: ["100", "500"],
      command: CommandType.in,
    })
    .order([{ prop: "insertTime", type: "DESC" }])
    .list();

  const page = await DuckyOrm.query(UserClass)
  .where([{prop:"id",value:500, command: CommandType.gt},{prop:"id",value:1000,command:CommandType.le}])
  .andOr({prop:"id",value:[500,501,502,503],command:CommandType.nin})
  .where({prop:"money",value:[1000,20000],command:CommandType.bet})
  .page(1,30);
  const single = await DuckyOrm.query(UserClass)
  .where([{prop:"id",value:500, command: CommandType.gt},{prop:"id",value:1000,command:CommandType.le}])
  .andOr({prop:"id",value:[500,501,502,503],command:CommandType.nin})
  .where({prop:"money",value:[1000,20000],command:CommandType.bet})
  .order([{prop:"id",type:"DESC"}])
  .single();

  await DuckyOrm.update(UserClass).setOnly({
    name: "Ducky"
  }).where({prop:"id",value:1, command:CommandType.eq}).exec();

  await DuckyOrm.update(UserClass).set({
    id:"",
    name:"DuckyYang",
    money:100,
    password:"123123",
    insertTime:""
  }).where({
    prop:"id",value:[1,10],command:CommandType.bet
  }).exec();
})();

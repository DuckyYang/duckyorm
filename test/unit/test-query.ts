/*
 * @Author: Ducky Yang
 * @Date: 2021-01-25 16:12:11
 * @LastEditTime: 2021-01-31 11:37:45
 * @LastEditors: Ducky Yang
 * @Description:
 * @FilePath: /duckyorm/test/unit/test-query.ts
 */

import { CommandType } from "../../src";
import LogicType from "../../src/lib/enum/LogicType";
import DuckyOrmWhereModel from "../../src/lib/model/DuckyOrmWhereModel";
import orm from "../util";
import { IDuckyOrmModel } from "../../src/types";

export default async () => {
  const model = orm.getModel("UserModel") as IDuckyOrmModel;

  const result = await model
    .query()
    .where(
      [
        new DuckyOrmWhereModel("email", "duckyyang@vip.qq.com", CommandType.eq),
        new DuckyOrmWhereModel("password", "duckyyang", CommandType.eq),
      ],
      LogicType.AND
    )
    .single()
    .catch((r) => {
      console.error(r);
    });
  console.log(result);
  // let res1 = await model?.query().where(new DuckyOrmWhereModel("id", 10, CommandType.lt)).list();
  // let res2 = await model?.query().where([
  //     new DuckyOrmWhereModel("id", 200, CommandType.lt),
  //     new DuckyOrmWhereModel("name", "%50%", CommandType.lk)
  // ]).list();

  // let res3 = await model?.query().where([
  //     new DuckyOrmWhereModel("id", 100, CommandType.lt),
  //     new DuckyOrmWhereModel("name", "%20%", CommandType.lk)
  // ], LogicType.OR).where(new DuckyOrmWhereModel("enabled", 1, CommandType.eq)).list();

  // let res4 = await model?.query().where([
  //     new DuckyOrmWhereModel("id", 100, CommandType.lt),
  //     new DuckyOrmWhereModel("name", "%20%", CommandType.lk)
  // ], LogicType.OR).where(new DuckyOrmWhereModel("enabled", 1, CommandType.eq)).page(1);

  // let res5 = await model?.query().where([
  //     new DuckyOrmWhereModel("id", 100, CommandType.lt),
  //     new DuckyOrmWhereModel("name", "%20%", CommandType.lk)
  // ], LogicType.OR).where(new DuckyOrmWhereModel("enabled", 1, CommandType.eq)).page(3, 8);

  // let res6 = await model?.query().where([
  //     new DuckyOrmWhereModel("id", 100, CommandType.lt),
  //     new DuckyOrmWhereModel("name", "%20%", CommandType.lk)
  // ], LogicType.OR).where(new DuckyOrmWhereModel("enabled", 1, CommandType.eq)).single();

  // console.log((res1));
  // console.log((res2));
  // console.log((res3));
  // console.log((res4));
  // console.log((res5));
  // console.log((res6));
};

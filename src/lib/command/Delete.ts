/*
 * @Author: Ducky Yang
 * @Date: 2021-01-20 15:52:38
 * @LastEditTime: 2021-02-09 14:27:59
 * @LastEditors: Ducky Yang
 * @Description: In User Settings Edit
 * @FilePath: \duckyorm\src\lib\command\Delete.ts
 */

import { IDuckyOrmModel, IDelete } from "../../types";
import DuckyOrmWhere from "./Where";
import Context from "../DuckyOrm";

class DuckyOrmDelete<T> extends DuckyOrmWhere implements IDelete<T> {
  dom: IDuckyOrmModel;

  constructor(dom: IDuckyOrmModel) {
    super(dom);
    this.dom = dom;
  }
  async exec() {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM \`${this.dom.tableName}\` WHERE ${
        this.whereExpression ? this.whereExpression : "1=0"
      };`;
      Context.execute(sql, this.whereValues).then(resolve).catch(reject);
    });
  }
}
export default DuckyOrmDelete;

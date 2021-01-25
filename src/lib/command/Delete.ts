/*
 * @Author: Ducky Yang
 * @Date: 2021-01-20 15:52:38
 * @LastEditTime: 2021-01-25 17:42:49
 * @LastEditors: Ducky Yang
 * @Description: In User Settings Edit
 * @FilePath: \FastMysqlOrm\src\lib\command\Delete.ts
 */

import { IDuckyOrmModel, IDelete } from "../../types";
import DuckyOrmWhere from "./Where";

class DuckyOrmDelete extends DuckyOrmWhere implements IDelete {
  dom: IDuckyOrmModel;
 
  constructor(dom: IDuckyOrmModel) {
    super(dom);
    this.dom = dom;
  }
  async exec() {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM \`${this.dom.tableName}\` WHERE ${this.whereExpression};`;
      this.dom
        .executeWithParams(sql, this.whereValues)
        .then(resolve)
        .catch(reject);
    });
  }
}
export default DuckyOrmDelete;

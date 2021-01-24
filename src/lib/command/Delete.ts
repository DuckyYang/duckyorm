/*
 * @Author: your name
 * @Date: 2021-01-20 15:52:38
 * @LastEditTime: 2021-01-22 14:19:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ducky.note\FastMysqlOrm\FastMysqlDelete.js
 */

import { IFastMysqlOrmModel, IDelete } from "../../types";

class FastMysqlDelete implements IDelete {
  fmom: IFastMysqlOrmModel;
  deleteExpression = {
    where: "",
  };
  whereValues: Array<string>;
  constructor(fmom: IFastMysqlOrmModel) {
    this.fmom = fmom;

    this.whereValues = [];
  }

  where(whereString: string, whereValues: Array<string>) {
    this.deleteExpression.where = whereString;
    this.whereValues = whereValues;
    return this;
  }

  async exec() {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM \`${this.fmom.tableName}\` WHERE ${this.deleteExpression.where};`;
      this.fmom
        .executeWithParams(sql, this.whereValues)
        .then(resolve)
        .catch(reject);
    });
  }
}
export default FastMysqlDelete;

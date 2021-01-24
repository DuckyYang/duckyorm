/*
 * @Author: Ducky Yang
 * @Date: 2021-01-20 15:39:31
 * @LastEditTime: 2021-01-24 09:37:22
 * @LastEditors: Ducky
 * @Description: In User Settings Edit
 * @FilePath: /duckyorm/src/lib/command/Update.ts
 */
import { IFastMysqlOrmModel, IUpdate } from "../../types";

class FastMysqlUpdate implements IUpdate {
  fmom: IFastMysqlOrmModel;

  updateExpression = {
    update: "",
    updateColumns: "",
    where: "1=0",
  };
  updateValues: Array<any> = [];
  /**
   * where sql placeholder's value
   */
  whereValues: Array<string> = [];

  constructor(fmom: IFastMysqlOrmModel) {
    this.fmom = fmom;
    this.updateExpression.update = `UPDATE \`${this.fmom.tableName}\``;
  }

  /**
   * 
   * @param {string} whereString where sql
   * @param {Array} whereValues where sql placeholder's value
   */
  where(whereString: string, whereValues: Array<string>) {
    this.updateExpression.where = whereString;
    this.whereValues = whereValues;
    return this;
  }
  /**
   * set update value
   * @param {object} value 
   */
  setColumns(value: object) {
    let updateArr = [],
      valueArr = [];
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        var modelDefine = this.fmom.modelDefines.find(
          (x) => x.propName === key
        );
        if (modelDefine && !modelDefine.ignore && !modelDefine.ignoreUpdate) {
          updateArr.push(`${modelDefine.colName}=?`);
          valueArr.push(value[key]);
        }
      }
    }
    this.updateExpression.updateColumns = updateArr.join(",");
    this.updateValues = valueArr;
    return this;
  }
  /**
   * exec sql
   */
  async exec() {
    return new Promise((resolve, reject) => {
      const sql = `${this.updateExpression.update} SET ${this.updateExpression.updateColumns} WHERE ${this.updateExpression.where};`;
      const values = this.updateValues.concat(this.whereValues);

      this.fmom.executeWithParams(sql, values).then(resolve).catch(reject);
    });
  }
}
export default FastMysqlUpdate;

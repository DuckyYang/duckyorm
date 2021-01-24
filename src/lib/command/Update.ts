/*
 * @Author: your name
 * @Date: 2021-01-20 15:39:31
 * @LastEditTime: 2021-01-22 13:38:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ducky.note\FastMysqlOrm\FastMysqlUpdate.js
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
   * where条件占位符对应的值
   */
  whereValues: Array<string> = [];

  constructor(fmom: IFastMysqlOrmModel) {
    this.fmom = fmom;
    this.updateExpression.update = `UPDATE \`${this.fmom.tableName}\``;
  }

  /**
   * 默认update语句不会执行，需强制指定where条件
   * @param {string} whereString 更新语句的where条件，
   * @param {Array} whereValues where条件中占位符对应的值
   */
  where(whereString: string, whereValues: Array<string>) {
    this.updateExpression.where = whereString;
    this.whereValues = whereValues;
    return this;
  }
  /**
   * @param {object} value 更新的对象
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
  async exec() {
    return new Promise((resolve, reject) => {
      const sql = `${this.updateExpression.update} SET ${this.updateExpression.updateColumns} WHERE ${this.updateExpression.where};`;
      const values = this.updateValues.concat(this.whereValues);

      this.fmom.executeWithParams(sql, values).then(resolve).catch(reject);
    });
  }
}
export default FastMysqlUpdate;

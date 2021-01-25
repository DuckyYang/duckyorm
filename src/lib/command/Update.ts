/*
 * @Author: Ducky Yang
 * @Date: 2021-01-20 15:39:31
 * @LastEditTime: 2021-01-25 17:43:06
 * @LastEditors: Ducky Yang
 * @Description: In User Settings Edit
 * @FilePath: \FastMysqlOrm\src\lib\command\Update.ts
 */
import { IDuckyOrmModel, IUpdate } from "../../types";
import DuckyOrmWhere from "./Where";

class DuckyOrmUpdate extends DuckyOrmWhere implements IUpdate {
  dom: IDuckyOrmModel;

  updateExpression = {
    update: "",
    updateColumns: ""
  };
  updateValues: Array<any> = [];

  constructor(dom: IDuckyOrmModel) {
    super(dom);

    this.dom = dom;
    this.updateExpression.update = `UPDATE \`${this.dom.tableName}\``;
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
        var modelDefine = this.dom.modelDefines.find(
          (x) => x.propName === key
        );
        if (modelDefine && !modelDefine.ignoreUpdate) {
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
      const sql = `${this.updateExpression.update} SET ${this.updateExpression.updateColumns} WHERE ${this.whereExpression || "1=0"};`;
      const values = this.updateValues.concat(this.whereValues);

      this.dom.executeWithParams(sql, values).then(resolve).catch(reject);
    });
  }
}
export default DuckyOrmUpdate;

/*
 * @Author: Ducky Yang
 * @Date: 2021-01-20 15:39:31
 * @LastEditTime: 2021-02-09 15:53:57
 * @LastEditors: Ducky Yang
 * @Description: In User Settings Edit
 * @FilePath: \duckyorm\src\lib\command\Update.ts
 */
import { IDuckyOrmModel, IObjectIndex, IUpdate } from "../../types";
import DuckyOrmWhere from "./Where";
import Context from "../DuckyOrm";

class DuckyOrmUpdate<T> extends DuckyOrmWhere implements IUpdate<T> {
  dom: IDuckyOrmModel;

  updateExpression = {
    update: "",
    updateColumns: "",
  };
  updateValues: Array<any> = [];

  constructor(dom: IDuckyOrmModel) {
    super(dom);

    this.dom = dom;
    this.updateExpression.update = `UPDATE \`${this.dom.tableName}\``;
  }

  /**
   * set update value
   * @param {T} value
   */
  set(value: T) {
    const getProperty = <T, K extends keyof T>(obj:T, key:K) => {
      return obj[key];
    }
    let updateArr = [],
      valueArr = [];
    for (const key in value) {
      if (getProperty(value, key)) {
        var modelDefine = this.dom.mapping.find((x) => x.prop === key);
        if (modelDefine && !modelDefine.ignoreUpdate) {
          updateArr.push(`${modelDefine.column}=?`);
          valueArr.push(value[key]);
        }
      }
    }
    this.updateExpression.updateColumns = updateArr.join(",");
    this.updateValues = valueArr;
    return this;
  }
  setOnly(value:IObjectIndex){
    let updateArr = [],
    valueArr = [];
  for (const key in value) {
    if (Object.hasOwnProperty.call(value, key)) {
      var modelDefine = this.dom.mapping.find((x) => x.prop === key);
      // if prop does not ignore update or not increment
      if (modelDefine && !modelDefine.ignoreUpdate && !modelDefine.increment) {
        updateArr.push(`${modelDefine.column}=?`);
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
      const sql = `${this.updateExpression.update} SET ${
        this.updateExpression.updateColumns
      } WHERE ${this.whereExpression || "1=0"};`;
      const values = this.updateValues.concat(
        this.whereValues
      );

      Context.execute(sql, values).then(resolve).catch(reject);
    });
  }
}
export default DuckyOrmUpdate;

/*
 * @Author: Ducky Yang
 * @Date: 2021-01-20 13:53:33
 * @LastEditTime: 2021-02-09 15:31:58
 * @LastEditors: Ducky Yang
 * @Description: In User Settings Edit
 * @FilePath: \duckyorm\src\lib\command\Insert.ts
 */
import { IDuckyOrmModel, IDuckyOrmModelMapping, IInsert, IObjectIndex } from "../../types";
import Context from "../DuckyOrm";

class DuckyOrmInsert<T> implements IInsert<T> {
  dom: IDuckyOrmModel;

  values: Array<object>;
  /**
   * sql of inserted columns
   */
  columnsExpression = "";
  /**
   * inserted columns model defines
   */
  columnModels: Array<IDuckyOrmModelMapping>;

  constructor(dom: IDuckyOrmModel) {
    this.dom = dom;
    this.values = [];
    this.columnModels = [];

    this.prepareInsertColumnSql();
  }

  /**
   * insert single value
   * @param {object} value
   */
  set(value: object | Array<object>) {
    if (Array.isArray(value)) {
      this.values = value;
    } else {
      this.values.push(value);
    }
    return this;
  }
  /**
   * exec sql
   */
  async exec() {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO \`${this.dom.tableName}\` (${this.columnsExpression}) VALUES ?`;
      const insertValues = this.prepareInsertValues();
      Context.execute(sql, [insertValues]).then(resolve).catch(reject);
    });
  }
  prepareInsertColumnSql() {
    let arr = [];
    for (let index = 0; index < this.dom.mapping.length; index++) {
      const mapping = this.dom.mapping[index];
      // if set ignore or is auto increment column
      if (!mapping.ignoreInsert && !mapping.increment) {
        arr.push("`" + mapping.column + "`");
        this.columnModels.push(mapping);
      }
    }
    this.columnsExpression = arr.join(",");
  }
  prepareInsertValues() {
    let insertValues = [];
    for (let i = 0; i < this.values.length; i++) {
      let insertValue = [];
      const value:IObjectIndex = this.values[i];
      for (let j = 0; j < this.columnModels.length; j++) {
        const model = this.columnModels[j];
        let val = value[model.prop];
        insertValue.push(val);
      }
      insertValues.push(insertValue);
    }
    return insertValues;
  }
}
export default DuckyOrmInsert;

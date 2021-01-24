/*
 * @Author: your name
 * @Date: 2021-01-20 13:53:33
 * @LastEditTime: 2021-01-22 14:57:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ducky.note\FastMysqlOrm\FastMysqlInsert.js
 */
import {
  IFastMysqlOrmModel,
  IInsert,
  IFastMysqlOrmModelDefine,
} from "../../types";

class FastMysqlInsert implements IInsert {
  fmom: IFastMysqlOrmModel;

  values: Array<object>;
  /**
   * 插入列sql表达式
   */
  columnsExpression = "";
  /**
   * 列定义的Model
   */
  columnModels: Array<IFastMysqlOrmModelDefine>;

  constructor(fmom: IFastMysqlOrmModel) {
    this.fmom = fmom;
    this.values = [];
    this.columnModels = [];

    this.prepareInsertColumnSql();
  }

  /**
   * 插入单条数据
   * @param {object} value
   */
  setValue(value: object) {
    this.values.push(value);
    return this;
  }
  /**
   * 批量插入
   * @param {Array<object>} values
   */
  setValues(values: Array<object>) {
    this.values = values;
    return this;
  }

  async exec() {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO \`${this.fmom.tableName}\` (${this.columnsExpression}) VALUES ?`;
      const insertValues = this.prepareInsertValues();
      this.fmom
        .executeWithParams(sql, [insertValues])
        .then(resolve)
        .catch(reject);
    });
  }
  prepareInsertColumnSql() {
    let arr = [];
    for (let index = 0; index < this.fmom.modelDefines.length; index++) {
      const modelDefine = this.fmom.modelDefines[index];
      // 没有忽略插入并且不是自增列
      if (
        !modelDefine.ignore &&
        !modelDefine.ignoreInsert &&
        !modelDefine.increment
      ) {
        arr.push("`" + modelDefine.colName + "`");
        this.columnModels.push(modelDefine);
      }
    }
    this.columnsExpression = arr.join(",");
  }
  prepareInsertValues() {
    let insertValues = [];
    for (let i = 0; i < this.values.length; i++) {
      let insertValue = [];
      const value = this.values[i];
      for (let j = 0; j < this.columnModels.length; j++) {
        const model = this.columnModels[j];
        let val = value[model.propName];
        if (val) {
          insertValue.push(val);
        } else {
          insertValue.push(model.default || "");
        }
      }
      insertValues.push(insertValue);
    }
    return insertValues;
  }
}
export default FastMysqlInsert;

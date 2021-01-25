/*
 * @Author: Ducky Yang
 * @Date: 2021-01-20 13:53:33
 * @LastEditTime: 2021-01-25 16:08:10
 * @LastEditors: Ducky Yang
 * @Description: In User Settings Edit
 * @FilePath: \FastMysqlOrm\src\lib\command\Insert.ts
 */
import {
  IDuckyOrmModel,
  IInsert,
  IDuckyOrmModelDefine,
} from "../../types";

class DuckyOrmInsert implements IInsert {
  fmom: IDuckyOrmModel;

  values: Array<object>;
  /**
   * sql of inserted columns
   */
  columnsExpression = "";
  /**
   * inserted columns model defines
   */
  columnModels: Array<IDuckyOrmModelDefine>;

  constructor(fmom: IDuckyOrmModel) {
    this.fmom = fmom;
    this.values = [];
    this.columnModels = [];

    this.prepareInsertColumnSql();
  }

  /**
   * insert single value
   * @param {object} value
   */
  setValue(value: object) {
    this.values.push(value);
    return this;
  }
  /**
   * insert multiple values
   * @param {Array<object>} values
   */
  setValues(values: Array<object>) {
    this.values = values;
    return this;
  }
/**
 * exec sql
 */
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
      // if set ignore or is auto increment column
      if (
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
        insertValue.push(val);
      }
      insertValues.push(insertValue);
    }
    return insertValues;
  }
}
export default DuckyOrmInsert;

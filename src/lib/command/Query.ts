/*
 * @Author: your name
 * @Date: 2021-01-20 13:21:26
 * @LastEditTime: 2021-01-22 13:37:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ducky.note\FastMysqlOrm\FastMysqlQuery.js
 */

import {
  IFastMysqlOrmModel,
  IQuery,
  IFastMysqlOrmModelDefine,
} from "../../types";

class FastMysqlQuery implements IQuery {
  fmom: IFastMysqlOrmModel;
  queryExpression = {
    select: "",
    from: "",
    where: "",
    order: "",
  };
  /**
   * where条件占位符对应的值
   */
  whereValues: Array<string> = [];
  constructor(fmom: IFastMysqlOrmModel) {
    this.fmom = fmom;

    this.queryExpression.from = `FROM \`${this.fmom.tableName}\``;
  }
  /**
   *
   * @param {string} whereString
   * @param {Array<string>} whereValues
   */
  where(whereString: string, whereValues: Array<string>) {
    if (whereString) {
      this.queryExpression.where = "WHERE " + whereString;
    }
    this.whereValues = whereValues;
    return this;
  }
  /**
   * 指定查询的列名
   * @param {any} columns 支持字符串数组和对象。columns={name:"userName"}，则生成SELECT name as userName FROM XXX
   */
  select(columns: object | Array<string>) {
    const modelDefines = this.fmom.modelDefines;
    // 如果col不为空，则查询指定的列名
    let arr = [];
    if (!columns || (Array.isArray(columns) && columns.length === 0)) {
      for (let index = 0; index < modelDefines.length; index++) {
        const modelDefine = modelDefines[index];
        if (!modelDefine.ignore && !modelDefine.ignoreSelect) {
          arr.push("`" + modelDefine.colName + "`");
        }
      }
    } else {
      if (Array.isArray(columns)) {
        for (let index = 0; index < columns.length; index++) {
          const colName = columns[index];
          const modelDefine = modelDefines.find((x) => x.colName === colName);
          if (modelDefine && !modelDefine.ignore && !modelDefine.ignoreSelect) {
            arr.push("`" + modelDefine.colName + "`");
          }
        }
      }
      if (typeof columns === "object") {
        for (const key in columns) {
          if (Object.hasOwnProperty.call(columns, key)) {
            const alias = columns[key];
            const modelDefine = modelDefines.find((x) => x.colName === key);
            if (
              modelDefine &&
              !modelDefine.ignore &&
              !modelDefine.ignoreSelect
            ) {
              arr.push("`" + modelDefine.colName + "` AS `" + alias + "`");
            }
          }
        }
      }
    }
    if (arr.length === 0) {
      throw new Error("no select columns");
    }
    this.queryExpression.select = `SELECT ${arr.join(",")}`;
    return this;
  }
  /**
   * 设置排序
   * @param {Array<Array<string>>} order 排序数组，例如：[["id","asc"],["age","desc"]]，解析为：order by id asc, age desc
   */
  order(order: Array<Array<string>>) {
    if (order.length > 0) {
      let arr = [];
      for (let i = 0; i < order.length; i++) {
        const orderArr = order[i];
        if (orderArr.length > 2) {
          const field = orderArr[0];
          const orderType = orderArr[1];
          if (
            field &&
            (orderType.toLowerCase() === "asc" ||
              orderType.toLowerCase() === "desc")
          ) {
            arr.push(`${field} ${orderType}`);
          }
        }
      }
      this.queryExpression.order = `ORDER BY ${arr.join(",")}`;
    }
    return this;
  }
  /**
   * 查询单条记录，返回top 1
   */
  async single() {
    return new Promise(async (resolve, reject) => {
      if (!this.queryExpression.select) {
        this.select([]);
      }
      const sql = `${this.queryExpression.select} ${this.queryExpression.from} ${this.queryExpression.where} ${this.queryExpression.order} LIMIT 1;`;
      try {
        let results = await this.fmom.executeWithParams(sql, this.whereValues);
        const models = _mapToModel(this.fmom.diffPropColMapping, results);
        if (models && models.length > 0) {
          resolve(models[0]);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  async list() {
    return new Promise(async (resolve, reject) => {
      if (!this.queryExpression.select) {
        this.select([]);
      }
      const sql = `${this.queryExpression.select} ${this.queryExpression.from} ${this.queryExpression.where} ${this.queryExpression.order};`;
      const totalSql = `SELECT COUNT(1) AS total ${this.queryExpression.from} ${this.queryExpression.where};`;
      try {
        let results = await this.fmom.executeWithParams(sql, this.whereValues);
        let total = await this.fmom.executeWithParams(
          totalSql,
          this.whereValues
        );

        const models = _mapToModel(this.fmom.diffPropColMapping, results);
        resolve([models, total[0].total]);
      } catch (error) {
        reject(error);
      }
    });
  }
  /**
   * 查询分页
   * @param {number} pageNo 分页索引
   * @param {number} pageSize 分页大小
   */
  async page(pageNo: number, pageSize: number) {
    return new Promise(async (resolve, reject) => {
      if (!pageNo || pageNo <= 0) {
        pageNo = 1;
      }
      if (!pageSize || pageSize <= 0) {
        pageSize = 12;
      }
      if (!this.queryExpression.select) {
        this.select([]);
      }
      const pageSql = `${this.queryExpression.select} ${
        this.queryExpression.from
      } ${this.queryExpression.where} ${this.queryExpression.order} LIMIT ${
        (pageNo - 1) * pageSize
      }, ${pageSize};`;

      const totalSql = `SELECT COUNT(1) AS total ${this.queryExpression.from} ${this.queryExpression.where};`;
      try {
        let results = await this.fmom.executeWithParams(
          pageSql,
          this.whereValues
        );
        let total = await this.fmom.executeWithParams(
          totalSql,
          this.whereValues
        );
        const models = _mapToModel(this.fmom.diffPropColMapping, results);
        resolve([models, total[0].total]);
      } catch (error) {
        reject(error);
      }
    });
  }
}
function _mapToModel(
  modelDefines: Array<IFastMysqlOrmModelDefine>,
  results: any
): Array<any> {
  if (results && Array.isArray(results) && results.length > 0) {
    for (let i = 0; i < results.length; i++) {
      let data = results[i];

      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          const value = data[key];

          const modelDefine = modelDefines.find((x) => x.colName === key);
          if (modelDefine && modelDefine.colName !== modelDefine.propName) {
            data[modelDefine.propName] = value;
            delete data[key];
          }
        }
      }
    }
  }
  return results;
}

export default FastMysqlQuery;

/*
 * @Author: Ducky Yang
 * @Date: 2021-01-20 13:21:26
 * @LastEditTime: 2021-02-09 15:32:09
 * @LastEditors: Ducky Yang
 * @Description: In User Settings Edit
 * @FilePath: \duckyorm\src\lib\command\Query.ts
 */

import { IDuckyOrmModel, IObjectIndex, IOrderBy, IQuery } from "../../types";
import DuckyOrmError from "../DuckyOrmError";
import DuckyOrmWhere from "./Where";
import Context from "../DuckyOrm";

class DuckyOrmQuery<T> extends DuckyOrmWhere implements IQuery<T> {
  dom: IDuckyOrmModel;
  queryExpression = {
    select: "",
    from: "",
    order: "",
  };
  constructor(dom: IDuckyOrmModel) {
    super(dom);
    this.dom = dom;

    this.queryExpression.from = `FROM \`${this.dom.tableName}\``;
  }

  /**
   * set query columns
   * @param {any} columns array or object.If is object like {name:"userName"}，
   * it will generate sql like 'SELECT name as userName FROM XXX;'
   */
  select(columns: any | Array<string>): IQuery<T> {
    const modelDefines = this.dom.mapping;
    // if columns is empty, it will use defines
    let arr = [];
    if (!columns || (Array.isArray(columns) && columns.length === 0)) {
      for (let index = 0; index < modelDefines.length; index++) {
        const modelDefine = modelDefines[index];
        if (!modelDefine.ignoreSelect) {
          arr.push("`" + modelDefine.column + "`");
        }
      }
    } else {
      if (Array.isArray(columns)) {
        for (let index = 0; index < columns.length; index++) {
          const colName = columns[index];
          const modelDefine = modelDefines.find((x) => x.column === colName);
          if (modelDefine && !modelDefine.ignoreSelect) {
            arr.push("`" + modelDefine.column + "`");
          }
        }
      }
      if (typeof columns === "object") {
        for (const key in columns) {
          if (Object.hasOwnProperty.call(columns, key)) {
            const alias = columns[key];
            const modelDefine = modelDefines.find((x) => x.column === key);
            if (modelDefine && !modelDefine.ignoreSelect) {
              arr.push("`" + modelDefine.column + "` AS `" + alias + "`");
            }
          }
        }
      }
    }
    if (arr.length === 0) {
      throw new DuckyOrmError("no select columns");
    }
    this.queryExpression.select = `SELECT ${arr.join(",")}`;
    return this;
  }
  /**
   * set query order
   * @param {Array<IOrderBy>} order eg: [["id","asc"],["age","desc"]]
   * sql is 'order by id asc, age desc'
   */
  order(order: Array<IOrderBy>): IQuery<T> {
    if (order.length > 0) {
      let arr = [];
      for (let i = 0; i < order.length; i++) {
        const orderBy = order[i];
        if (
          orderBy.prop &&
          (orderBy.type === "ASC" || orderBy.type === "DESC")
        ) {
          const model = this.dom.mapping.find((x) => x.prop === orderBy.prop);
          arr.push(`${model?.column || orderBy.prop} ${orderBy.type}`);
        }
      }
      this.queryExpression.order = `ORDER BY ${arr.join(",")}`;
    }
    return this;
  }
  /**
   * query single record
   */
  async single(): Promise<T | null> {
    return new Promise(async (resolve, reject) => {
      if (!this.queryExpression.select) {
        this.select([]);
      }
      const sql = `${this.queryExpression.select} ${
        this.queryExpression.from
      } ${this.whereExpression ? "WHERE " + this.whereExpression : ""} ${
        this.queryExpression.order
      } LIMIT 1;`;
      try {
        let results = await Context.execute(
          sql,
          this.whereValues
        );
        const models = this._mapToModel(results);
        if (models && models.length > 0) {
          resolve(models[0] as T);
        } else {
          resolve(null);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  /**
   * query all records
   */
  async list(): Promise<T[]> {
    return new Promise(async (resolve, reject) => {
      if (!this.queryExpression.select) {
        this.select([]);
      }
      const sql = `${this.queryExpression.select} ${
        this.queryExpression.from
      } ${this.whereExpression ? "WHERE " + this.whereExpression : ""} ${
        this.queryExpression.order
      };`;
      try {
        let results = await Context.execute(
          sql,
          this.whereValues
        );

        const models = this._mapToModel(results);
        resolve(models as T[]);
      } catch (error) {
        reject(error);
      }
    });
  }
  /**
   * query row count
   */
  async count(): Promise<number> {
    return new Promise(async (resolve, reject) => {
      if (!this.queryExpression.select) {
        this.select([]);
      }
      const totalSql = `SELECT COUNT(1) AS total ${
        this.queryExpression.from
      }  ${this.whereExpression ? "WHERE " + this.whereExpression : ""};`;
      try {
        let total = await Context.execute(
          totalSql,
          this.whereValues
        );
        resolve(total[0].total);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * query page records
   * @param {number} pageNo page number
   * @param {number} pageSize page size, default 12
   */
  async page(pageNo: number, pageSize?: number): Promise<T[]> {
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
      }  ${this.whereExpression ? "WHERE " + this.whereExpression : ""} ${
        this.queryExpression.order
      } LIMIT ${(pageNo - 1) * pageSize}, ${pageSize};`;

      try {
        let results = await Context.execute(
          pageSql,
          this.whereValues
        );

        const models = this._mapToModel(results);
        resolve(models as T[]);
      } catch (error) {
        reject(error);
      }
    });
  }
  _mapToModel(results: any): Array<any> {
    const modelMapping = this.dom.mappingDiff;
    let mapResults = [];
    if (results && Array.isArray(results) && results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        let res = results[i];
        let data:IObjectIndex = {};
        for (const key in res) {
          if (Object.hasOwnProperty.call(res, key)) {
            const value = res[key];

            const modelDefine = modelMapping.find((x) => x.column === key);
            if (modelDefine && modelDefine.column !== modelDefine.prop) {
              data.constructor = this.dom.ctor;
              data[modelDefine.prop] = value;
            } else {
              data[key] = value;
            }
          }
        }
        mapResults.push(data);
      }
    }
    return mapResults;
  }
}

export default DuckyOrmQuery;

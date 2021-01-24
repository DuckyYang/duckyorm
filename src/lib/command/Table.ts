/*
 * @Author: Ducky Yang
 * @Date: 2021-01-20 15:58:44
 * @LastEditTime: 2021-01-24 09:35:18
 * @LastEditors: Ducky
 * @Description: In User Settings Edit
 * @FilePath: /duckyorm/src/lib/command/Table.ts
 */

import DbType from "../DbType";
import { IFastMysqlOrmModel, ITable } from "../../types";

class FastMysqlTable implements ITable {
  fmom: IFastMysqlOrmModel;
  constructor(fmom: IFastMysqlOrmModel) {
    this.fmom = fmom;

    this.prepareColumns();
  }

  createExpression = {
    columns: "",
  };
  async create() {
    return new Promise((resolve, reject) => {
      const sql = `CREATE TABLE \`${this.fmom.tableName}\` (${this.createExpression.columns});`;
      this.fmom.execute(sql).then(resolve).catch(reject);
    });
  }
  async drop() {
    return new Promise((resolve, reject) => {
      const sql = `DROP TABLE \`${this.fmom.tableName}\`;`;
      this.fmom.execute(sql).then(resolve).catch(reject);
    });
  }
  async update() {
    return new Promise((resolve, reject) => {
      // const sql = `DROP TABLE \`${this.fmom.tableName}\`;`;
      // this.fmom.execute(sql).then(resolve).catch(reject);
      resolve("not implement");
    });
  }
  prepareColumns() {
    let arr = [];
    for (let i = 0; i < this.fmom.modelDefines.length; i++) {
      const model = this.fmom.modelDefines[i];

      let sql = `\`${model.colName}\` `;
      switch (model.dbType) {
        case DbType.binary:
        case DbType.tinyint:
        case DbType.smallint:
        case DbType.bigint:
        case DbType.int:
        case DbType.char:
        case DbType.varchar:
        case DbType.datetime:
        case DbType.integer:
        case DbType.mediumint:
        case DbType.time:
        case DbType.timestamp:
        case DbType.varbinary:
          sql += `${model.dbType}(${model.size})`;
          break;
        case DbType.bit:
          sql += `bit(1)`;
          break;
        case DbType.float:
        case DbType.double:
        case DbType.decimal:
        case DbType.numeric:
        case DbType.real:
          sql += `${model.dbType}(${model.size},${model.scale})`;
          break;
        case DbType.blob:
        case DbType.date:
        case DbType.enum:
        case DbType.json:
        case DbType.linestring:
        case DbType.longblob:
        case DbType.longtext:
        case DbType.mediumblob:
        case DbType.mediumtext:
        case DbType.multilinestring:
        case DbType.multipoint:
        case DbType.point:
        case DbType.tinyblob:
        case DbType.tinytext:
        case DbType.text:
          sql += `${model.dbType}`;
          break;
        default:
          sql += `${model.dbType}`;
          break;
      }
      // 是否可空
      sql += ` ${model.nullable ? "NULL" : "NOT NULL"}`;
      // 主键
      sql += ` ${model.primaryKey ? "PRIMARY KEY" : ""}`;
      // 自增
      sql += ` ${model.increment ? "AUTO_INCREMENT" : ""}`;
      // 默认值
      if (model.default) {
        sql += ` DEFAULT ${model.default}`;
      }
      // 设置字符集
      if (model.charset) {
        sql += ` CHARACTER SET ${model.charset}`;
      }
      if (model.dbType === DbType.timestamp && model.useCurrentTimestamp) {
        sql += ` ON UPDATE CURRENT_TIMESTAMP`;
      }
      arr.push(sql + "\r\n");
    }
    this.createExpression.columns = arr.join(",");
  }
  compareTableSchemes() {
    this.fmom
      .execute(`SELECT * FROM \`${this.fmom.tableName}\` LIMIT 0;`)
      .then((results) => {
        // 比对modelDefines的信息，将有差异的列进行更新或删除
      })
      .catch(() => {});
  }
}
export default FastMysqlTable;

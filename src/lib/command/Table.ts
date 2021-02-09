/*
 * @Author: Ducky Yang
 * @Date: 2021-01-20 15:58:44
 * @LastEditTime: 2021-02-09 11:36:55
 * @LastEditors: Ducky Yang
 * @Description: In User Settings Edit
 * @FilePath: \duckyorm\src\lib\command\Table.ts
 */

import { DbType } from "../Enum";
import { IDuckyOrmModel, ITable } from "../../types";
import Context from "../DuckyOrm";

class DuckyOrmTable<T> implements ITable<T> {
  dom: IDuckyOrmModel;
  constructor(dom: IDuckyOrmModel) {
    this.dom = dom;

    this.prepareColumns();
  }

  createExpression = {
    columns: "",
  };
  async create() {
    return new Promise((resolve, reject) => {
      const sql = `CREATE TABLE IF NOT EXISTS \`${this.dom.tableName}\` (${this.createExpression.columns});`;
      Context.execute(sql).then(resolve).catch(reject);
    });
  }
  async drop() {
    return new Promise((resolve, reject) => {
      const sql = `DROP TABLE IF EXISTS \`${this.dom.tableName}\`;`;
      Context.execute(sql).then(resolve).catch(reject);
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
    for (let i = 0; i < this.dom.mapping.length; i++) {
      const model = this.dom.mapping[i];

      let sql = `\`${model.column}\` `;
      switch (model.type) {
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
          sql += `${model.type}(${model.size})`;
          break;
        case DbType.bit:
          sql += `bit(1)`;
          break;
        case DbType.float:
        case DbType.double:
        case DbType.decimal:
        case DbType.numeric:
        case DbType.real:
          sql += `${model.type}(${model.size},${model.scale})`;
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
          sql += `${model.type}`;
          break;
        default:
          sql += `${model.type}`;
          break;
      }
      // 是否可空
      sql += ` ${model.nullable ? "NULL" : "NOT NULL"}`;
      // 主键
      sql += ` ${model.primary ? "PRIMARY KEY" : ""}`;
      // 自增
      sql += ` ${model.increment ? "AUTO_INCREMENT" : ""}`;
      // 默认值
      if (model.default) {
        sql += ` DEFAULT ${model.default}`;
      }
      if (
        (model.type === DbType.timestamp || model.type === DbType.datetime) &&
        model.useCurrentTimestamp
      ) {
        sql += ` DEFAULT CURRENT_TIMESTAMP(${model.size}) ON UPDATE CURRENT_TIMESTAMP(${model.size})`;
      }
      arr.push(sql + "\r\n");
    }
    this.createExpression.columns = arr.join(",");
  }
  compareTableSchemes() {
    Context.execute(`SELECT * FROM \`${this.dom.tableName}\` LIMIT 0;`)
      .then((results) => {
        // 比对modelDefines的信息，将有差异的列进行更新或删除
      })
      .catch(() => {});
  }
}
export default DuckyOrmTable;

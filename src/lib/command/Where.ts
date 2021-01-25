/*
 * @Author: Ducky Yang
 * @Date: 2021-01-25 13:26:50
 * @LastEditTime: 2021-01-25 17:43:22
 * @LastEditors: Ducky Yang
 * @Description:
 * @FilePath: \FastMysqlOrm\src\lib\command\where.ts
 */

import { CommandType } from "../..";
import { IDuckyOrmModel, IDuckyOrmWhereModel } from "../../types";
import LogicType from "../enum/LogicType";
import DuckyOrmWhereModel from "../model/DuckyOrmWhereModel";
import DuckyOrmError  from "../DuckyOrmError";

class DuckyOrmWhere {
  dom: IDuckyOrmModel;
  whereExpression: string;
  whereValues: Array<number | string>;
  constructor(dom: IDuckyOrmModel) {
    this.dom = dom;
    this.whereExpression = "";
    this.whereValues = [];
  }
  where(
    where: IDuckyOrmWhereModel | Array<IDuckyOrmWhereModel>,
    logicType?: LogicType
  ) {
    // if where is DuckyOrmWhereModel
    if (where instanceof DuckyOrmWhereModel) {
      const expr = this.toSql(where);
      if (this.whereExpression === "") {
        this.whereExpression = `(${expr})`;
      } else {
        this.whereExpression += ` AND (${expr})`;
      }
    }
    if (Array.isArray(where)) {
      let fullExpr = "";
      for (let i = 0; i < where.length; i++) {
        const item = where[i];
        const expr = this.toSql(item);

        if (fullExpr === "") {
          fullExpr = expr;
        } else {
          fullExpr += `${
            logicType
              ? logicType === LogicType.AND
                ? " AND "
                : " OR "
              : " AND "
          } ${expr}`;
        }
      }
      if (this.whereExpression === "") {
        this.whereExpression = `(${fullExpr})`;
      } else {
        this.whereExpression += ` AND (${fullExpr})`;
      }
    }
    return this;
  }

  private toSql(where: IDuckyOrmWhereModel) {
    const model = this.dom.modelDefines.find(
      (x) => x.propName === where.propName
    );
    let expr = `\`${model?.colName || where.propName}\` `;

    switch (where.commandType) {
      case CommandType.lt:
        expr += `< ?`;
        break;
      case CommandType.le:
        expr += "<= ?";
        break;
      case CommandType.eq:
        expr += "= ?";
        break;
      case CommandType.ge:
        expr += ">= ?";
        break;
      case CommandType.gt:
        expr += "> ?";
        break;
      case CommandType.neq:
        expr += "<> ?";
        break;
      case CommandType.lk:
        expr += "LIKE ?";
        break;
      case CommandType.nlk:
        expr += "NOT LIKE ?";
        break;
      case CommandType.in:
        expr += "IN ?";
        break;
      case CommandType.nin:
        expr += "NOT IN ?";
        break;
      case CommandType.bet:
        expr += "BETWEEN ? AND ?";
        break;
      default:
        expr += "= ?";
        break;
    }
    if (where.commandType != CommandType.bet) {
      this.whereValues.push(this.convertValueToSql(where.value));
    } else {
      if (
        !Array.isArray(where.value) ||
        where.value.length < 2 ||
        where.value.some((x) => typeof x !== "number")
      ) {
        throw new DuckyOrmError (
          "if command type is between, the value must be of Array<number> type and contains at least two members"
        );
      }
      this.whereValues.push(where.value[0]);
      this.whereValues.push(where.value[1]);
    }
    return expr;
  }
  private convertValueToSql(
    value: number | string | Array<number | string>
  ): string | number {
    if (typeof value === "number") {
      return value;
    }
    if (Array.isArray(value)) {
      let arr = [];
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        if (typeof item === "number") {
          arr.push(item);
        } else {
          arr.push(`'${item}'`);
        }
      }
      return `(${arr.join(",")})`;
    }
    return `'${value}'`;
  }
}

export default DuckyOrmWhere;

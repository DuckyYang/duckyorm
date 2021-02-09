/*
 * @Author: Ducky Yang
 * @Date: 2021-01-25 13:26:50
 * @LastEditTime: 2021-02-09 20:33:48
 * @LastEditors: Ducky Yang
 * @Description:
 * @FilePath: /duckyorm/src/lib/command/Where.ts
 */

import { CommandType, LogicType } from "../Enum";
import { IDuckyOrmModel, IDuckyOrmWhereModel, IWhere } from "../../types";
import DuckyOrmError from "../DuckyOrmError";

class DuckyOrmWhere implements IWhere {
  dom: IDuckyOrmModel;
  whereExpression: string;
  whereValues: Array<any>;
  constructor(dom: IDuckyOrmModel) {
    this.dom = dom;
    this.whereExpression = "";
    this.whereValues = [];
  }
  where(
    where: IDuckyOrmWhereModel | Array<IDuckyOrmWhereModel>,
    logicType?: LogicType
  ) {
    let sql = this.compile(where, logicType);
    this.whereExpression =
      this.whereExpression === ""
        ? `${sql}`
        : `(${this.whereExpression}) AND (${sql})`;
    return this;
  }

  and(
    where: IDuckyOrmWhereModel | Array<IDuckyOrmWhereModel>,
    logicType?: LogicType
  ) {
    let sql = this.compile(where, logicType);
    this.whereExpression =
      this.whereExpression === ""
        ? `${sql}`
        : `(${this.whereExpression}) AND (${sql})`;
    return this;
  }

  or(
    where: IDuckyOrmWhereModel | Array<IDuckyOrmWhereModel>,
    logicType?: LogicType
  ) {
    let sql = this.compile(where, logicType);
    this.whereExpression =
      this.whereExpression === ""
        ? `${sql}`
        : `${this.whereExpression} OR (${sql})`;
    return this;
  }
  andOr(
    where: IDuckyOrmWhereModel | Array<IDuckyOrmWhereModel>,
    logicType?: LogicType
  ) {
    let sql = this.compile(where, logicType);
    this.whereExpression =
      this.whereExpression === ""
        ? `${sql}`
        : `((${this.whereExpression}) OR (${sql}))`;
    return this;
  }

  private compile(
    where: IDuckyOrmWhereModel | Array<IDuckyOrmWhereModel>,
    logicType?: LogicType
  ) {
    let fullExpr = "";
    if (Array.isArray(where)) {
      for (let i = 0; i < where.length; i++) {
        const item = where[i];
        const expr = this.toSql(item);
        fullExpr =
          fullExpr === ""
            ? expr
            : `${fullExpr} ${
                logicType
                  ? logicType === LogicType.AND
                    ? " AND "
                    : " OR "
                  : " AND "
              } ${expr}`;
      }
    } else {
      fullExpr = this.toSql(where);
    }
    return fullExpr;
  }
  private toSql(where: IDuckyOrmWhereModel) {
    const model = this.dom.mapping.find((x) => x.prop === where.prop);
    let expr = `\`${model?.column || where.prop}\` `;

    switch (where.command) {
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
        expr += "IN (?)";
        break;
      case CommandType.nin:
        expr += "NOT IN (?)";
        break;
      case CommandType.bet:
        expr += "BETWEEN ? AND ?";
        break;
      default:
        expr += "= ?";
        break;
    }
    if (where.command != CommandType.bet) {
      this.whereValues.push(where.value);
    } else {
      if (
        !Array.isArray(where.value) ||
        where.value.length < 2 ||
        where.value.some((x) => typeof x !== "number")
      ) {
        throw new DuckyOrmError(
          "if command type is between, the value must be of Array<number> type and contains two members"
        );
      }
      this.whereValues.push(where.value[0]);
      this.whereValues.push(where.value[1]);
    }
    return expr;
  }
}

export default DuckyOrmWhere;

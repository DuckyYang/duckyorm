/*
 * @Author: Ducky Yang
 * @Date: 2021-02-09 10:28:59
 * @LastEditTime: 2021-02-09 14:10:37
 * @LastEditors: Ducky Yang
 * @Description:
 * @FilePath: \duckyorm\src\lib\Enum.ts
 */

export enum CommandType {
  /**
   * less than
   */
  lt = "less_than",
  /**
   * less than or equal to
   */
  le = "less_than_or_equal_to",
  /**
   * equal to
   */
  eq = "equal_to",
  /**
   * greater than or equal to
   */
  ge = "greater_than_or_equal_to",
  /**
   * greater than
   */
  gt = "greater_than",
  /**
   * not equal to
   */
  neq = "not_equal_to",
  /**
   * like
   */
  lk = "like",
  /**
   * not like
   */
  nlk = "not_like",
  /**
   * in
   */
  in = "in",
  /**
   * not in
   */
  nin = "not_in",
  /**
   * between
   */
  bet = "between",
}

export enum DbType {
  binary = "binary",
  tinyint = "tinyint",
  smallint = "smallint",
  bigint = "bigint",
  int = "int",
  char = "char",
  varchar = "varchar",
  datetime = "datetime",
  integer = "integer",
  mediumint = "mediumint",
  time = "time",
  timestamp = "timestamp",
  varbinary = "varbinary",
  bit = "bit",
  float = "float",
  double = "double",
  decimal = "decimal",
  numeric = "numeric",
  real = "real",
  blob = "blob",
  date = "date",
  enum = "enum",
  json = "json",
  linestring = "linestring",
  longblob = "longblob",
  longtext = "longtext",
  mediumblob = "mediumblob",
  mediumtext = "mediumtext",
  multilinestring = "multilinestring",
  multipoint = "multipoint",
  point = "point",
  text = "text",
  tinyblob = "tinyblob",
  tinytext = "tinytext",
}

export enum LogicType {
  AND = "AND",
  OR = "OR",
}

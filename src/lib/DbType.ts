/*
 * @Author: Ducky Yang
 * @Date: 2021-01-22 10:42:31
 * @LastEditTime: 2021-01-24 09:23:34
 * @LastEditors: Ducky
 * @Description: In User Settings Edit
 * @FilePath: /duckyorm/src/lib/DbType.ts
 */

enum DbType {
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

  export default DbType;
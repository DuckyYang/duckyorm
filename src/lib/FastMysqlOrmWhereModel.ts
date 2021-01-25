/*
 * @Author: Ducky Yang
 * @Date: 2021-01-25 12:26:49
 * @LastEditTime: 2021-01-25 12:27:30
 * @LastEditors: Ducky Yang
 * @Description: 
 * @FilePath: /duckyorm/src/lib/FastMysqlOrmWhereModel.ts
 * @
 */ 
import CommandType from "./CommandType";

class FastMysqlOrmWhereModel {
    propName: string;
    value: any;
    commandType: CommandType;
    constructor(propName:string, value:any, commandType: CommandType){
        this.propName = propName || "";
        this.value = value;
        this.commandType = commandType;
    }
}
export default FastMysqlOrmWhereModel;

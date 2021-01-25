/*
 * @Author: Ducky Yang
 * @Date: 2021-01-24 20:54:29
 * @LastEditTime: 2021-01-25 12:28:01
 * @LastEditors: Ducky Yang
 * @Description: 
 * @FilePath: /duckyorm/src/lib/FastMysqlOrmWhere.ts
 * @
 */ 

 import CommandType from "./CommandType";
import { IFastMysqlOrmWhere } from "../types";
import FastMysqlOrmWhereModel from "./FastMysqlOrmWhereModel";

class FastMysqlOrmWhere implements IFastMysqlOrmWhere {
    whereExpression: string;
    whereArray: Array<FastMysqlOrmWhereModel>;
    constructor(){
        this.whereExpression = "";
        this.whereArray = [];
    }
    /**
     * 
     * @param propName property name
     * @param value property value
     */
    where(propName: string, value:any, commandType: CommandType){
        this.whereArray.push(new FastMysqlOrmWhereModel(propName, value, commandType));
        return this;
    }
    
}

export default FastMysqlOrmWhere;
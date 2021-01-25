/*
 * @Author: Ducky Yang
 * @Date: 2021-01-25 15:57:56
 * @LastEditTime: 2021-01-25 16:09:38
 * @LastEditors: Ducky Yang
 * @Description: 
 * @FilePath: \FastMysqlOrm\test\unit\test-insert.ts
 */

import orm from "../util";

 class UserModel {
     id: number;
     name: string;
     money: number;
     enabled: number;
     mobile: string;
     constructor(){
        this.id = 0;
        this.name = "";
        this.money = 0;
        this.enabled = 1;
        this.mobile = "";    
     }
 }

export default async ()=>{
    let arr = [];
    for (let index = 0; index < 1000; index++) {
        let user = new UserModel();
        user.name = "name"+index;
        user.money = index* 100;
        user.enabled = index % 2;
        user.mobile = "mobile"+index+index*2
        arr.push(user);        
    }
    await orm.getModel("UserModel")?.insert().setValues(arr).exec();
};
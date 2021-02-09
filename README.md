## DuckyOrm

> nodejs, typescript, mysql, orm

> Author: Ducky Yang
>
> Email: duckyyang@vip.qq.com

### Install

 `npm install duckyorm`

### Tips

> This is an ORM framework based on node MySQL in the process of learning node and typescript. 
>
> If you are willing to give me some advice and suggestions, please commit issues.
>
> If you want to find a stable and efficient orm framework, em.... maybe it's a worth try.
>
> Thanks

## Quick Start

- Define a ORM model

``` javascript
@table("user")
export default class UserClass {
  @column("id", DbType.int, { size: 8 }, false)
  @primary(true, true)
  id: string = "";
  @column("name", DbType.varchar)
  name: string = "";
  @column("money", DbType.decimal, { size: 8, scale: 2 })
  money: number = 0;
  @column("password", DbType.varchar, { size: 20 })
  @ignore(true)
  password: string = "";
  @column("insert_time", DbType.datetime)
  @useCurrentTimestamp()
  @ignore(false, true)
  insertTime: string = "";
}
```

- Connect to MySql database and registe class to ORM internal cache

```javascript
const config = new DuckyOrmConfig(
    "localhost",
    3306,
    "root",
    "password",
    "orm_test"
  );

  config.aop.afterExecute = (sql, obj) => {
    console.log(sql);
    console.log(obj);
  };

  await DuckyOrm.connect(config);
 // registe Class
  DuckyOrm.define([UserClass]);

```

- Try to execute CRUD command

```javascript
import { DuckyOrm } from "duckyorm";

// drop table if exists
DuckyOrm.table(UserClass).drop();
// create table if not exists
DuckyOrm.table(UserClass).create();

let arr = [];
for (let index = 0; index < 10000; index++) {
    let user = new UserClass();
    user.name = "name"+index;
    user.money = index* 100;
    user.password = "pwd"+index*2;
    arr.push(user);
}
// bulk insert 
await DuckyOrm.insert(UserClass).set(arr).exec();
// delete 
await DuckyOrm.delete(UserClass).where({prop:"name", value:"%2%", command: CommandType.lk}).exec();
//  query all where name like 10
const list1 = await DuckyOrm.query(UserClass).where({prop:"name", value:"%10%",command: CommandType.lk}).list();
// query page records
const page = await DuckyOrm.query(UserClass)
    .where([{prop:"id",value:500, command: CommandType.gt},{prop:"id",value:1000,command:CommandType.le}])
    .page(1,30);
// get single record
const single = await DuckyOrm.query(UserClass)
    .where({prop:"money",value:[1000,20000],command:CommandType.bet})
    .order([{prop:"id",type:"DESC"}])
    .single();
// only update `name` column
await DuckyOrm.update(UserClass).setOnly({
    name: "Ducky"
}).where({prop:"id",value:1, command:CommandType.eq}).exec();
// update all columns if not ignore update or auto increment
await DuckyOrm.update(UserClass).set({
    id:"",
    name:"DuckyYang",
    money:100,
    password:"123123",
    insertTime:""
  }).where({
    prop:"id",value:[1,10],command:CommandType.bet
  }).exec();
```

## Documentation

#### `DuckyOrmConfig`

- `host`: Connection host.
- `port`: Connection port.
- `user`: MySql login username.
- `password`: MySql login password.
- `database`: Default database.
- `charset`: Database charset.
- `timeout`: Connect timeout.
- `aop`: 
  - `beforeExecute(sql:string,parameters:object)`: Callback before sql execute.
  - `afterExecute(sql:string,results:object)`: Callback after sql execute.

#### `DuckyOrm`

- `connect(config:IDuckyOrmConfig)`: Connect to database using configs.
- `define(classes:any[])`: Define class model to ORM internal cache. When execute command, ORM will find model defines from cache.
- `query<T>(cls:{new():T})`: Build a query command.
- `insert<T>(cls:{new():T})`: Build a insert command.
- `update<T>(cls:{new():T})`: Build a update command.
- `delete<T>(cls:{new():T})`: Build a delete command.
- `table<T>(cls:{new():T})`: Build a table command to create/drop/update table scheme.
- `execute(sql:string, parameters:any[])`: Execute custom sql.

#### `Decorators`

- `@table(name:string)`: Declare the relationship between class and table.
- `@column(name: string,dbType: DbType,size?: ITypeSize,nullable?: boolean)`: Declare the mapping between property and column.
- `@primary(primary: boolean, increment: boolean)`: Declare column is a primary key.
- `@ignore(ignoreSelect: boolean,ignoreInsert?: boolean,ignoreUpdate?: boolean)`: Set column ignore when execute command.
- `@defaultValue(value: string | number)`: Set column default value.
- `@useCurrentTimestamp()`: If column's type is datetime or timestamp, it will use CURRENT_TIMESTAMP to set value when updated.

#### `IDuckyOrmModel`

- `className`: Class name.
- `tableName`: Table name.
- `mapping`: The property and column's mapping.
- `mappingDiff`: The mapping array if property doesn't equal to column.
- `ctor`: The class constructor function.

#### `IDuckyOrmModelMapping`

- `prop`: Property name.
- `column`: Column name.
- `primary`: Primary key or not.
- `increment`: Auto increment. If true, the column must be primary.
- `nullable`: Null or not null.
- `type`: Set column type .
- `size`: Set column size,default 255(datetime and time is 6).
- `scale`: Set column scale for decimal,float,double,numeric,real.
- `default`: Set default value.
- `useCurrentTimestamp`: Use current timestamp to update value.
- `ignoreInsert`: Ignore when inserted.
- `ignoreSelect`: Ignore when selected.
- `ignoreUpdate`: Ignore when updated.

#### `ITable`

- `create()`: Create table with model defines.
- `drop()`: Drop table
- `update()`: Update table scheme with model defines. Not implemented yet.

#### `IDelete`

- `exec()`: Execute command. If where condition is empty, it will not run.

#### `IUpdate`

- `set(value: T)`: Set all columns and values of Class. It will update columns if not ignore update or not auto increment.
- `setOnly(value:IObjectIndex)`: Set the columns and values that only need to be updated.
- `exec()`: Execute command. If where condition is empty, it will not run.

#### `IInsert`

- `set(value: object | Array<object>)`:Set inserted values.
- `exec()`: Execute command.

#### `IQuery`

- `select(columns: any | Array<string>)`:Set query columns.If columns is object, the object value will be used as column alias name.
- `order(order: Array<IOrderBy>)`: Set query order by.
- `single()`: Query single record. If get multiple records, it will return top 1.
- `list()`: Query all records.
- `page(pageNo: number, pageSize?: number)`: Query paged records.Default pageNo is 1 and pageSize is 12.
- `count()`: Get records row count.

#### `IWhere`

> IQuery, IUpdate, IDelete extends IWhere to set where condition.

- `where(where: IDuckyOrmWhereModel)`: Set where condition with `AND` command.
- `where(where: Array<IDuckyOrmWhereModel>, logicType?: LogicType)`: Set where group with `AND` command, and `logicType` indicates the relationship between where group.
- `and(where: IDuckyOrmWhereModel)`: Same as `where`.
- `and(where: Array<IDuckyOrmWhereModel>, logicType?: LogicType)`: Same as `where`.
- `or(where: IDuckyOrmWhereModel)`: Set where with `OR` command. It will be spliced with condition existed.
- `or(where: Array<IDuckyOrmWhereModel>, logicType?: LogicType)`: Set where group with `OR` command.
- `andOr(where: IDuckyOrmWhereModel)`: Set where with `OR` command. It will add brackets to the previous condition before splice. 
- `andOr(where: Array<IDuckyOrmWhereModel>, logicType?: LogicType)`: Set where group with `OR` command.

- The difference between `or()` and `andOr()` is

```javascript
// let previous condition is
const condition = 'id>0 and (id=1 or id=10)';
// use andOr to splice a new condition `name='Ducky'`, the condition is
const condition = "(id>0 and (id=1 or id=10)) or name='Ducky'";
// if use or, the condition is 
const condition = "id>0 and (id=1 or id=10) or name='Ducky'";
```

#### `IDuckyOrmWhereModel`

- `prop`: property name of Class.
- `value`: where values.
- `command`: where command just like `eq` is  `=` ,`gt` is `>`,`lt` is `<`. 

### Samples

- Query the specified column

```javascript
// SELECT `id`,`name` FROM `user` WHERE `name` LIKE '%10%';
await DuckyOrm.query(UserClass)
	.select(["id","name"])
  .where({prop:"name", value:"%10%",command: CommandType.lk})
  .list();
// SELECT `id`,`name` AS `UserName` FROM `user` WHERE `name` LIKE '%10%';
await DuckyOrm.query(UserClass)
	.select({id:"id",name:"UserName"})
  .where({prop:"name", value:"%10%",command: CommandType.lk})
  .list();
```

- Query with where group

```javascript
// SELECT `id`,`name`,`money`,`insert_time` FROM `user` WHERE `id`>500 AND `id`<=1000;
await DuckyOrm.query(UserClass)
  .where([
  	{prop:"id",value:500, command: CommandType.gt},
		{prop:"id",value:1000,command:CommandType.le}
   ])
  .list();
// SELECT `id`,`name`,`money`,`insert_time` FROM `user` WHERE (`name` LIKE '%10%' OR `money` <2000) AND (`id`>50);
await DuckyOrm.query(UserClass)
  .where([
    {prop:"name", value:"%10%",command: CommandType.lk},
    {prop:"money", value:"2000",command: CommandType.lt}
  ],LogicType.OR)
  .where([
    {prop:"id", value:"50",command: CommandType.gt}
  ])
  .list();
```

- Query using multiple where conditions

```javascript
// SELECT `id`,`name`,`money`,`insert_time` FROM `user` WHERE `name` LIKE '%10%' AND `money` <2000 OR `id`>50;
await DuckyOrm.query(UserClass)
  .where([
    {prop:"name", value:"%10%",command: CommandType.lk},
    {prop:"money", value:"2000",command: CommandType.lt}
  ],LogicType.AND)
  .or([
    {prop:"id", value:"50",command: CommandType.gt}
  ])
  .list();
// SELECT `id`,`name`,`money`,`insert_time` FROM `user` WHERE (`name` LIKE '%10%' AND `money` <2000) OR `id`>50;
await DuckyOrm.query(UserClass)
  .where([
    {prop:"name", value:"%10%",command: CommandType.lk},
    {prop:"money", value:"2000",command: CommandType.lt}
  ],LogicType.AND)
  .andOr([
    {prop:"id", value:"50",command: CommandType.gt}
  ])
  .list();
```

- Query like

```javascript
// SELECT `id`,`name`,`money`,`insert_time` FROM `user` WHERE `name` LIKE '%10%';
await DuckyOrm.query(UserClass)
  .where({prop:"name", value:"%10%",command: CommandType.lk})
  .list();
```

- Query in

```javascript
// SELECT `id`,`name`,`money`,`insert_time` FROM `user` WHERE `id` IN ('100','500') ORDER BY `insert_time` DESC; 
await DuckyOrm.query(UserClass)
    .where({
      prop: "id",
      value: ["100", "500"],
      command: CommandType.in,
    })
    .list();
```

- Query between

```javascript
// SELECT `id`,`name`,`money`,`insert_time` FROM `user` WHERE `id` BETWEEN 100 AND 500; 
await DuckyOrm.query(UserClass).where({
    prop:"id",value:[100,500],command:CommandType.bet
  }).list();
```

- Query order by

```javascript
// SELECT `id`,`name`,`money`,`insert_time` FROM `user` WHERE `id` BETWEEN 100 AND 500 ORDER BY `insert_time` DESC; 
await DuckyOrm.query(UserClass).where({
    prop:"id",value:[100,500],command:CommandType.bet
  })
  .order([{ prop: "insertTime", type: "DESC" }])
  .list();
```

### Final

> I'm a newbee of nodejs and typescript, but unfamiliar language makes me more interested in learning. This framework will continue to improve and enrich the functions, which will be used in my future study.
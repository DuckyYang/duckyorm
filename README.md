## DuckyOrm

> nodejs, typescript, mysql, orm

> Author: Ducky Yang
>
> Email: duckyyang@vip.qq.com

> This is an ORM framework based on node MySQL development in the process of learning node and typescript. 

> Install: `npm install duckyorm`

> Tips:
>
> If you are willing to give me some advice and suggestions, please commit issue, thanks very much!
>
> If you want to find a stable and efficient orm framework, e... maybe it's a worth try.
>
> Thanks

## QuickStart

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

- Connect to mysql database and registe class to ORM internal

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
  - `beforeExecute`: Callback before sql execute , it's with two parameters `sql` and `parameters`.
  - `afterExecute`: Callback after sql execute,it's with tow parameters `sql` and `results`.

#### `DuckyOrm`

- `connect`: Connect to database using configs.
- `define`: Define class model to ORM internal cache. When execute command, ORM will find model defines from cache.
- `query<T>`: Build a query command.
- `insert<T>`: Build a insert command.
- `update<T>`: Build a update command.
- `delete<T>`: Build a delete command.
- `table<T>`: Build a table command to create/drop/update table scheme.
- `execute`: Execute custom sql.

#### `Decorators`

- `@table`: Declare the relationship between class and table.
- `@column`: Declare the mapping between property and column.
- `@primary`: Declare column is a primary key.
- `@ignore`: Set column ignore when execute command.
- `@defaultValue`: Set column default value.
- `@useCurrentTimestamp`: If column's type is datetime or timestamp, it will use CURRENT_TIMESTAMP to set value when updated.

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

- `create`: Create table with model defines.
- `drop`: Drop table
- `update`: Update table scheme with model defines. Not implemented yet.

#### `IDelete`

- `exec`: Execute command. If where condition is empty, it will not run.

#### `IUpdate`

- `set`: Set all columns and values of Class. It will update columns if not ignore update or not auto increment.
- `setOnly`: Set the columns and values that only need to be updated.
- `exec`: Execute command. If where condition is empty, it will not run.

#### `IInsert`

- `set`:Set inserted values.
- `exec`: Execute command.

#### `IQuery`

- `select`:Set query columns.If columns is object, the object value will be used as column alias name.
- `order`: Set query order by.
- `single`: Query single record. If get multiple records, it will return top 1.
- `list`: Query all records.
- `page`: Query paged records.
- `count`: Get records row count.

#### `IWhere`

- `where`: Set where condition with `AND` commands
- 
/*
 * @Author: Ducky Yang
 * @Date: 2021-01-25 17:40:02
 * @LastEditTime: 2021-01-25 17:42:05
 * @LastEditors: Ducky Yang
 * @Description:
 * @FilePath: \FastMysqlOrm\src\lib\DuckyOrmError.ts
 */

class DuckyOrmError extends Error {
  constructor(message: string) {
    super("DuckyOrm Error:" + message);
  }
}

export default DuckyOrmError;
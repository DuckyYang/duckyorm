/*
 * @Author: Ducky Yang
 * @Date: 2021-01-24 20:39:08
 * @LastEditTime: 2021-01-24 21:04:22
 * @LastEditors: Ducky Yang
 * @Description:
 * @FilePath: /duckyorm/src/lib/CommandType.ts
 * @
 */

enum CommandType {
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
  bet = "between"
}

export default CommandType;

import connection from "../Config/dbConfig.mjs";

const findUserIdInFailedAttempts = async (user_id) => {
  const queryLoginFailTable = `SELECT user_id,cant_login_until FROM login_attempt WHERE user_id =? `;

  try {
    const [result] = await connection.query(queryLoginFailTable, user_id);
    return result;
  } catch (error) {
    throw new Error("Cannot get user_id in the table attempts fails" + error);
  }
};

const recordFirstFailedAttempt = async (user_id) => {
  const queryInsert = `INSERT INTO login_attempt (user_id,last_fail_attempt,count_attempt) VALUES (?,NOW(),1)`;

  try {
    const [result] = await connection.query(queryInsert, [user_id]);
    return result;
  } catch (error) {
    throw new Error("Error insert into login attempt table");
  }
};

const incrementFailedAttempts = async (user_id, count_attempt) => {
  const queryUpdate = `UPDATE login_attempt SET count_attempt =?,last_fail_attempt=NOW() WHERE user_id=?`;
  try {
    const [result] = await connection.query(queryUpdate, [
      count_attempt,
      user_id,
    ]);
    return result;
  } catch (error) {
    throw new Error("Error to increment failed attempts", error.message);
  }
};

const lockUserAccount = async (cant_login_until, user_id) => {
  const queryUpdate = `UPDATE login_attempt SET cant_login_until=? WHERE user_id=?`;
  try {
    const [result] = await connection.query(queryUpdate, [
      cant_login_until,
      user_id,
    ]);
  } catch (error) {
    throw new Error("Error with locking the user");
  }
};

const getFailedLoginAttempts = async (user_id) => {
  const query = `SELECT count_attempt FROM login_attempt WHERE user_id=?`;

  try {
    const [result] = await connection.query(query, [user_id]);
    return result;
  } catch (error) {
    throw new Error("Can not get failed attempts");
  }
};

const clearFailedAttempts = async (user_id) => {
  const queryDeleteInLoginFailTable = `DELETE FROM login_attempt WHERE user_id=?`;
  try {
    const [result] = await connection.query(queryDeleteInLoginFailTable, [
      user_id,
    ]);
  } catch (error) {
    throw new Error("No data to delete");
  }
};

const findUserByEmail = async (email) => {
  const loginQuery = `SELECT user_id ,email, password FROM user WHERE email= ?`;

  try {
    const [result] = await connection.query(loginQuery, [email]);
    return result;
  } catch (error) {
    throw new Error("Error to get the user from the table");
  }
};
export {
  findUserIdInFailedAttempts,
  incrementFailedAttempts,
  lockUserAccount,
  clearFailedAttempts,
  recordFirstFailedAttempt,
  findUserByEmail,
  getFailedLoginAttempts,
};

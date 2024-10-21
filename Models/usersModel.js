import connection from "../Config/dbConfig.mjs";

const createUser = async (email, password, name) => {
  const queryCreateUser =
    "INSERT INTO user(email, password, name) VALUES(?, ?, ?)";
  const values = [email, password, name];
  try {
    const [result] = await connection.query(queryCreateUser, values);
  } catch (error) {
    throw new Error("Error during user creation");
  }
};

const getUserByEmail = async (email) => {
  const queryText = "SELECT * FROM user WHERE email = ?";
  const result = await connection.query(queryText, [email]);
  return result[0];
};

const getAllEmails = async () => {
  const querygetAllEmails = `SELECT email FROM user`;

  try {
    const [emails] = await connection.query(querygetAllEmails);
    return emails;
  } catch (error) {
    throw new Error("Error during get all emails");
  }
};

const getAllUsers = async () => {
  const querygetAllUsers = `SELECT user_id FROM user`;
  try {
    const [users] = await connection.query(querygetAllUsers);
    return users;
  } catch (error) {
    throw new Error("Error during get All users");
  }
};
export { createUser, getUserByEmail, getAllEmails, getAllUsers };

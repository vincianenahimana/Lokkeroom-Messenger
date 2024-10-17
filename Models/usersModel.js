import connection from "../Config/dbConfig.mjs";

const createUser = async (email, password, name) => {
    const queryCreateUser = 'INSERT INTO user(email, password, name) VALUES(?, ?, ?)';
    const values = [email, password, name];
    try {
        const [result] = await connection.query(queryCreateUser, values);
    } catch (error) {
        throw new Error('Error during user creation');
    }
};

const getUserByEmail = async (email) => {
    const queryText = 'SELECT * FROM user WHERE email = ?';
    const result = await connection.query(queryText, [email]);
    return result[0];
};

export {createUser, getUserByEmail}
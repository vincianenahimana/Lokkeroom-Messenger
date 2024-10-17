import bcrypt from "bcrypt";
import connection from "../Config/dbConfig.mjs";
import {createUser} from "../Models/usersModel.js";
import {generateToken, verifyToken} from "../Middleware/middleware.js";


const signUp = async (req, res) => {
    const {email, password, name} = req.body;
    if (!email || !password) {
        return res.status(400).send({message: 'Email and password are required'});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    try {
        const userId = await createUser(email, hashedPassword, name);


        return res.status(201).send({message: 'User created successfully', userId});
    } catch (error) {
        res.status(500).send({message: 'Error during user creation'});
    }
}

const login = async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).send({message: 'Email and password are required'});
    }
    try {
        const loginQuery = `SELECT email, password FROM user WHERE email= ?`;
        const [result] = await connection.query(loginQuery, [email])
        if (!result) {
            return res.status(401).send({message: 'User not found'});
        }
        const userInfos = result[0];
        console.log(userInfos);

        const correctPassword = await bcrypt.compare(password, userInfos.password);
        if (!correctPassword) {
            return res.status(401).send({message: 'Wrong password'});
        }
        const token = generateToken(userInfos);
        return res.status(200).send({info: 'Successfully logged in', token, message :'Your token will expire in 1 hour.'});




    } catch {
        return res.status(401).send({message: 'Error during login', });
    }
}

export {signUp, login};
import jwt from "jsonwebtoken";

const generateToken = (user) => {
    return jwt.sign({userId: user.id}, process.env.JWT_TOKEN, {expiresIn: '1h'});
}

const verifyToken = (req, res, next) => {
    const authHeader = req.header('authorization');

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res
            .status(401)
            .json({ error: 'Incorrect Token' });
    }
    const token = authHeader.replace('Bearer ', '');

    if(!token) {
        return res
            .status(401)
            .json({ error: 'No Token Provided' });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_TOKEN);
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error : "Incorrect Token" });
    }

}

export {generateToken, verifyToken};
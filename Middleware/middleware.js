import jwt from "jsonwebtoken";
//
// const generateToken = (user) => {
//     return jwt.sign({userId: user.id}, process.env.JWT_TOKEN, {expiresIn: '1h'});
// }
//
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).send({message: 'Token is missing'});
    }

    jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
        if (err) return res.status(401).send({message: 'Invalid Token'});

            req.user = user;
            next()
        });
}
//     const authHeader = req.header('authorization');
//
//     if(!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res
//             .status(401)
//             .json({ error: 'Incorrect Token' });
//     }
//     const token = authHeader.replace('Bearer ', '');
//
//     if(!token) {
//         return res
//             .status(401)
//             .json({ error: 'No Token Provided' });
//     }
//
//     try {
//         jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
//             if (err) return res.status(401).send({message: 'Invalid Token'});
//             req.user = user;
//             next();
//         })
//
//     } catch (error) {
//         console.log(error);
//         return res.status(401).json({ error : "Incorrect Token" });
//     }
//
// }

export { verifyToken};
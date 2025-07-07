import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({ message: 'No token provided' });
    }

    //Extract the token that comes after 'Bearer' 
    const token = authHeader.split(' ')[1]; 
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };
        next(); //Proceed to next middleware or router
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid token '});
    }
}

export default authMiddleware;
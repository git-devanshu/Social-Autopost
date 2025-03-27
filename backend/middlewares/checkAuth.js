require('dotenv').config();
const jwt = require('jsonwebtoken');

// check the JWT and attach the decoded payload to the req object
const checkAuthorization = (req, res, next)=>{
    const token = req.headers.authorization;
    if(token){
        try{
            const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET);
            if(!decoded.id || !decoded.email){
                return res.status(401).json({ message : 'Authorization Error' });
            }
            req.id = decoded.id;
            req.email = decoded.email;
            next();
        }
        catch(error){
            res.status(401).json({ message : 'Authorization Error' });
        }
    }
    else{
        res.status(401).json({ message : 'Authorization Error' });
    }
}

module.exports = {checkAuthorization};

const jwt = require('jsonwebtoken');

const fetchuser = (req,res,next)=>{
    //Get the user from the jwt token and add id to req object
    
    const token = req.header('Authorization');
    if(!token){
        res.stauts(401).send({error : "please authenticate using a valid token"})
    }

    try {
        const data = jwt.decode(token);
        req.user = data;
        next();
    } catch (error) {
        res.stauts(401).send({error : "please authenticare using a valid token"})
    }
}

module.exports = fetchuser;
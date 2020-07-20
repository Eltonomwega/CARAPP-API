const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{

    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token,"qwerty1234");
        req.userData = decoded;
        if(decoded.isAdmin){
        next();
        }else{
            console.log(decoded)
            return res.status(401).json({
                message: 'you do not have the required priviledges for this action'
                
            }); 
        }
    }catch(error){
        return res.status(401).json({
            message: 'Auth failed'
        });
    }



};
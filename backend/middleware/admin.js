
/*module.exports = function (req, res, next) {

    if(!req.user.isAdmin) {
        return res.status(403).send("Vous devez avoir les droits Administrateur")
    }
    next();
}*/

// IMPORTS
const jwt = require('jsonwebtoken');

// EXPORT middleware
module.exports = (req, res, next) => {    
  try {       
    const token = req.headers.authorization.split(' ')[1];    
    const decodedToken = jwt.verify(token, '${process.env.TOKEN}');    
    const userId = decodedToken.userId;
    const isAdmin = decodedToken.isAdmin;    
    
    if(!isAdmin) {
        return res.status(403).send("Vous devez avoir les droits Administrateur")
    }
    req.isAdmin = isAdmin;
    console.log("isAdmin", isAdmin)
    next();

  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};
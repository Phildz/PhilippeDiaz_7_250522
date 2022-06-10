// IMPORTS
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ObjectId = require('mongoose').Types.ObjectId;

// EXPORTS

exports.signup = (req, res, next) => {    
    bcrypt.hash(req.body.password, 10)        
        .then(hash => {            
            const user = new User({                
                email: req.body.email,                
                password: hash,              
            });           
            user.save()                
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {    
    User.findOne({ email: req.body.email })        
        .then(user => {           
            if (!user) {                
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }            
            bcrypt.compare(req.body.password, user.password)                
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }                    
                    res.status(200).json({
                        userId: user._id,                        
                        token: jwt.sign(
                            { userId: user._id/*, isAdmin: user.isAdmin */},
                            '${process.env.TOKEN}',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

//logout user

/*exports.logout = (req, res)=>{
    User.findById(req.user._id).then((rUser)=>{
      rUser.online = false;
      rUser.save();
      });
    req.logout();
    res.redirect("/");
  };*/

/*exports.logout = (req,res) => {
    res.cookie('token', '',  { maxAge : 2000, httpOnly: true, sameSite : 'strict' }) // secure : true
    res.status(200).json({ message : 'utilisateur déconnecté' });
  }*/

/*exports.logout = (req, res, next) => {
    req.user.deleteToken(req.token,(err,user)=>{
        console.log(req.user);
        if(err) return res.status(400).send(err);
        res.sendStatus(200).json("user déconnecté");
    });

};*/
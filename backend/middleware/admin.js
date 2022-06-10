
const User = require('../models/user');

const authPage = (permissions) => {
    return (req, res, next) => {
        User.findOne({ email: req.body.email })            
            .then(user => {                
                if (!user) {                    
                    return res.status(401).json({ error: 'Utilisateur non trouvé !' });
                }
                const userRole = user.role;
                if (permissions.includes(userRole)) {                    
                    next()
                } else {
                    return res.status(401).json("permission non accordée")
                }
            })
            .catch(error => res.status(500).json({ error }));
    }
}

module.exports = authPage;




const User = require('../models/user');

const authPage = (permissions) => {
    return (req, res, next) => {
        User.findOne({ email: req.body.email })
            // findOne = fonct async don bloc then + catch
            .then(user => {
                // on vérifie si on a récupéré un user ou non
                if (!user) {
                    // un 401 pour dire non autorisé
                    return res.status(401).json({ error: 'Utilisateur non trouvé !' });
                }
                const userRole = user.role;

                if (permissions.includes(userRole)) {
                    //res.status(201).json("User Admin identifié");
                    next()
                } else {
                    return res.status(401).json("permission non accordée")
                }
            })
            .catch(error => res.status(500).json({ error }));
    }
}

module.exports = authPage;



// IMPORTS
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ObjectId = require('mongoose').Types.ObjectId;

// EXPORTS

exports.signup = (req, res, next) => {
    // hachage du mdp = fonction async => then + catch
    // on passe le mdp du corps de req passé par le frontend
    // le salt = combien de fois on exécute l'algo de hachage, ici 10 tours
    // = suffisant pour faire un mdp sécurisé : +trs = +tps
    bcrypt.hash(req.body.password, 10)
        // on récupère le hash de mdp qu'on va ensuite enregistrer dans un nouveau
        // user qu'on va enregistrer dans la Bdd
        .then(hash => {
            // on créé le nouveau utilisateur avec le modèle mongoose
            const user = new User({
                // on passe l'adresse fournie dans le corps de la requête
                email: req.body.email,
                // comme mdp on enregistre le hash
                password: hash,
                //picture: req.body.picture,
                //pseudo: req.body.pseudo
            });
            // méthode save pour enregistrer dans la Bdd
            user.save()
                // on renvoie un 201 pour une création de ressource
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// 2- pour connecter des utilisateurs existants
exports.login = (req, res, next) => {
    // trouver un seul utilisateur de la bdd
    // objet de comparaison (filtre) = utilisateur pour qui l'adresse mail correspond
    // à celle envoyée dans la requête
    User.findOne({ email: req.body.email })
        // findOne = fonct async don bloc then + catch
        .then(user => {
            // on vérifie si on a récupéré un user ou non
            if (!user) {
                // un 401 pour dire non autorisé
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // ici on a bien trouvé un utilisateur et on va compare avec la
            // méthode compare le mdp reçu dans la requête et celui enregistré
            // pour l'user (enregistré dans notre document user)
            bcrypt.compare(req.body.password, user.password)
                // valid renvoyé est un booléen
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    // statut 200 pour une requête réalisée et on renvoie un message json
                    res.status(200).json({
                        userId: user._id,
                        // méthode sign, 1er arg = id du user, 2ème = clé secrète pour
                        // l'encodage, 3ème = arg de config = appliquer une expiration token
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
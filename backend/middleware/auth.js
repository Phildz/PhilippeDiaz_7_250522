
// IMPORTS
const jwt = require('jsonwebtoken');

// "on va exporter un middleware classique"
module.exports = (req, res, next) => {
    // utilisation de blocs try et catch car il y a plusieurs élts qui peuvent
    // poser problème dans ce qui va être fait
  try {   
    // on connait la forme du header pour récupérer le token
    // on va split autour de l'espace et ça retourne un tableau avec bearer 
    // en 1er elt et le token en 2ème elt, on garde que le 2 elt
    // à la moindre erreur, celle-ci sera retournée dans le bloc catch
    const token = req.headers.authorization.split(' ')[1];
    // décoder le token - utilisation d'une constante qui va utiliser le
    // package jsonwebtoken + la fonction vérify
    // on veut vérifier le token = 1er argtv, le 2ème argt c'est la clé secrete
    const decodedToken = jwt.verify(token, '${process.env.TOKEN}');
    // quand on décode le token, ça devient un objet js classique
    // donc on peut récupérer le user id qui est dedans
    const userId = decodedToken.userId;
    //const isAdmin = decodedToken.isAdmin;    
    // si il y a un user id avec la req, on veut vérifier la correspondance 
    // avec celle du token
    // si on a un user id et que celui ci est différent du user id
    // on veut retourner une erreur = ne pas authentifier la req
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {      
        // on passe la requête au prochain middleware dans les routes que
        // l'on souhaite protéger --> dans stuff 
      next();         
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};
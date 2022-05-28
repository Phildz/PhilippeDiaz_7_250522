// IMPORTS
const multer = require('multer');

// CONSTANTES
  // --- préparation d'un dictionnaire = objet
const MIME_TYPES = {
    // --- les 3 différents objets qu'on peut avoir depuis le frontend
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};


// --- création d'un objet de configuration pour multer, diskStorage = enregistrer sur le disque
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
      // --- argt null pour dire qu'il n'y a pas eu d'erreur, 2ème argt = nom du dossier
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
      // --- générer le nom du fichier, accès au nom origine du fichier = propriété originalname
      // --- on élimine les espaces potentiels en utilisant des underscores
      // --- on split autout des espace = création 1 tableau avec les mots du nom de fichier
      // --- on rejoint le tableau en 1 seul string en remplaçant les " " par des "_"
    const name = file.originalname.split(' ').join('_');
      // --- on applique une extension à partir du mime_type = image/jpg ou /png, = l'élt du dictionnaire 
      // --- correspondant au mime type du fichier envoyé par le FE
    const extension = MIME_TYPES[file.mimetype];
      // on appelle le callback avec null pour dire pas d'erreur, création du filename entier + timestamp 
      // --- = Date.now() pour le rendre le + unique possible
    callback(null, name + Date.now() + '.' + extension);
  }
});

// export de notre middleware configuré, méthode multer à laquelle on passe l'objet storage
// --- + méthode single = fichier unique (non un groupe de fichiers), on indique qu'il s'agit 
// --- de fichier image uniquement
module.exports = multer({storage: storage}).single('image');
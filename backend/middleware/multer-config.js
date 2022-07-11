// IMPORTS
const multer = require('multer');

  //--- les 3 différents objets qu'on peut avoir depuis le frontend
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif' : 'gif'
};

// --- création d'un objet de configuration pour multer, diskStorage = enregistrer sur le disque
const storage = multer.diskStorage({
  destination: (req, file, callback) => {      
    callback(null, 'images');  },
  filename: (req, file, callback) => {      
    const name = file.originalname.split(' ').join('_');      
    const extension = MIME_TYPES[file.mimetype];      
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');
// IMPORTS
const express = require('express');
const router = express.Router();
    // --- middleware auth
const auth = require('../middleware/auth');
    // --- middleware multer
const multer = require('../middleware/multer-config');
const publicationCtrl = require('../controllers/publication');


// --- 2- lorsque l'on veut protéger une route, on ajoute le middleware avant
// --- le controleur et on l'applique tout simplement en ajoutant "auth"
// --- on protège même le fait d'aller chercher le stuff dans la bdd (.get)
// ---2A- on ajoute multer à la route post / 3A- idem pour route Put

// ROUTES

router.get('/', auth, publicationCtrl.readAllPublication);
router.get('/:id', auth, publicationCtrl.readOnePublication);
router.post('/', auth, multer, publicationCtrl.createPublication);
router.put('/:id', auth, multer, publicationCtrl.updatePublication);
router.delete('/:id', auth, publicationCtrl.deletePublication);
router.post('/:id/like', auth, publicationCtrl.likePublication);


module.exports = router;
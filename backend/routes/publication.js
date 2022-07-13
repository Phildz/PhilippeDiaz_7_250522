// IMPORTS
const express = require('express');
const router = express.Router();
    // --- middleware auth
const auth = require('../middleware/auth');
    // --- middleware multer
const multer = require('../middleware/multer-config');
const publicationCtrl = require('../controllers/publication');
const admin = require('../middleware/admin');
const authPage = require('../middleware/admin');

// ROUTES

router.get('/', /*auth, */publicationCtrl.readAllPublication);
router.get('/:id', /*auth, */publicationCtrl.readOnePublication);
router.post('/', auth /*, multer */, publicationCtrl.createPublication);
router.put('/:id', auth, /*multer,*/ publicationCtrl.updatePublication);
router.delete('/:id', auth, publicationCtrl.deletePublication);
router.post('/:id/like', auth, publicationCtrl.likePublication);


module.exports = router;
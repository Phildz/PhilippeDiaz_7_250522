// IMPORTS
const express = require('express');
// --- création d'un routeur avec la fonction Router() à importer dans app.js
const router = express.Router();
const userCtrl = require('../controllers/user');

// ROUTES
    // --- Signup et Login sont des routes post car le frontend va envoyer des informations 
    // ---adresse mail et mdp
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
// router.get('/logout', userCtrl.logout);

router.get('/', userCtrl.getAllUsers);
router.get('/:id', userCtrl.userInfo);
router.put('/:id', userCtrl.updateUser);
router.delete('/:id', userCtrl.deleteUser);

module.exports = router;
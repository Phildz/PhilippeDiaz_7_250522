// IMPORTS
const express = require('express');
// --- création d'un routeur avec la fonction Router() à importer dans app.js
const router = express.Router();
const userCtrl = require('../controllers/user');

// ROUTES
    // --- ce sont des routes post car le frontend va envoyer des informations adresse mail et mdp
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
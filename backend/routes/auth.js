// IMPORTS
const express = require('express');
// --- création d'un routeur avec la fonction Router() à importer dans app.js
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

// ROUTES
    // --- auth
router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);
//router.delete('/logout', userCtrl.logout);

module.exports = router;
// IMPORTS
const router = require("express").Router();
//const express = require('express');
// --- création d'un routeur avec la fonction Router() à importer dans app.js
//const router = express.Router();
const authCtrl = require('../controllers/auth.controller');
//const auth = require('../middleware/auth');


// ROUTES
    // --- auth
router.post('/register', authCtrl.signUp);
router.post('/login', authCtrl.signIn);
//router.get('/logout', authCtrl.logout);

module.exports = router;
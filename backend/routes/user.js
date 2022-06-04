// IMPORTS
const express = require('express');
// --- création d'un routeur avec la fonction Router() à importer dans app.js
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
//const authPage = require('../middleware/admin');

const auth = require('../middleware/auth');
const authPage = require('../middleware/admin');


// ROUTES
// --- base de données
router.get('/', auth, authPage(["admin"]), userCtrl.getAllUsers);
router.get('/:id', auth, authPage(["admin"]), userCtrl.userInfo);
router.put('/:id', auth, authPage(["admin"]),userCtrl.updateUser);
router.delete('/:id', auth, authPage(["admin"]),userCtrl.deleteUser);

module.exports = router;
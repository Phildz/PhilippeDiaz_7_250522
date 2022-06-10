// IMPORTS
const express = require('express');
// --- création d'un routeur avec la fonction Router() à importer dans app.js
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');
const auth = require('../middleware/auth');


// ROUTES
    // --- auth
router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);
//router.post('/logout',auth , authCtrl.logout);

// Logout
//router.get("/logout", authCtrl.logout);


/*router.get('/logout', function(req, res, next) {
    req.session.destroy(() => {
     req.logout();
     res.redirect("/"); //Inside a callback… bulletproof!
    });
   });*/

/*router.get('/logout', function(req, res, next) {
   
    if(!req.session.viewCount) {
        req.session.viewCount = 1;
    } else {
        req.session.viewCount += 1;
    }
    res.render('index', {viewCount: req.session.viewCount});
})*/

module.exports = router;
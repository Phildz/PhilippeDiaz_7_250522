// IMPORTS

const express = require('express');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
const path = require('path');
const publicationRoutes = require('./routes/publication');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
//const session = require('express-session');
const { application } = require('express');
const app = express();

// APP

app.use(express.json());

// Gestion de la sécurité
app.use((req, res, next) => {
    // permet l'accès à l'API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    // permet d'ajouter des headers spécifiques aux requêtes envoyées vers l'API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');        
    // permet d'envoyer des requêtes avec les méthodes mentionnée
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
  });

app.use(bodyParser.json());

// routes
// on indique que l'on va utiliser les routeurs définis par
app.use('/api/auth', authRoutes);
app.use('/api/publication', publicationRoutes);


//app.use('/api/user', userRoutes);

/*app.use(session({
  secret: '${process.env.TOKEN}',
  resave: false,
  saveUninitialized: false,
}))*/


// création middleware répondant aux req envoyées à /images
// et servant le dossier statique /images en utilisant express.static()
// chemin déterminé par la const path, utilisation méthode .join() avec
// dirnamme = nom dossier où on se trouve dans lequel on rajout images
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
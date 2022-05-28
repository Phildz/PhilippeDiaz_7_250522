//--- Création schéma de données dataSauce
const mongoose = require('mongoose');
const {isEmail} = require('validator');

// --- Création plugin pour n'autoriser qu'une unique adresse mail
//const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    // --- unique = true pour qu'il soit impossible d'entrer 2 fois la même adresse mail
    // --- fonctionne mais possiblité d'erreur avec mongoDB d'où nécessité d'ajouter
    // --- un package 
  email: { type: String, required: true, unique: true, validate : [isEmail], lowercase : true, trim : true, },
  password: { type: String, required: true, minLength : 6, maxLength: 1024,}
});

// --- on va appliquer dce validator au schéma avant d'en faire un modèle
//userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
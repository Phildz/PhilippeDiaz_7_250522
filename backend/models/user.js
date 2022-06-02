//--- Création schéma de données dataSauce
const mongoose = require('mongoose');
// fonction qui valide l'email : renvoie true ou false
const { isEmail } = require('validator');

// --- Création plugin pour n'autoriser qu'une unique adresse mail
//const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema(
  // --- unique = true pour qu'il soit impossible d'entrer 2 fois la même adresse mail
  // --- fonctionne mais possiblité d'erreur avec mongoDB d'où nécessité d'ajouter
  // --- un package
  {
    email: { type: String, required: true, unique: true, validate: [isEmail], lowercase: true, trim: true, },
    password: { type: String, required: true, minLength: 6, maxLength: 1024, },
    picture: { type: String, default: "./uploads/profil/random-user.png" },
    //pseudo: { type: String, required: true },
    //likes: { type: [String], required: true },
    bio: { type: String, maxLength: 1024,},
    admin:{type:Boolean, required:true, default:false}
  },
  {
    timestamps: true,
  }
);

// --- on va appliquer dce validator au schéma avant d'en faire un modèle
//userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
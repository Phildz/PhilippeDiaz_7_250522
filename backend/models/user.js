//--- Création schéma de données dataSauce
const mongoose = require('mongoose');
// fonction qui valide l'email : renvoie true ou false
const { isEmail } = require('validator');

//const jwt = require('jsonwebtoken');

// --- Création plugin pour n'autoriser qu'une unique adresse mail
//const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema(  
  {
    email: { type: String, required: true, unique: true, validate: [isEmail], lowercase: true, trim: true, },
    password: { type: String, required: true, minLength: 6, maxLength: 1024, },
    picture: { type: String, default: "./uploads/profil/random-user.png" },    
    role: {type: String, default: "user"},
    isAdmin: {type: Boolean, default: false }
  },
  {
    timestamps: true,
  }
);

/*userSchema.methods.generateTokens = function() {
  const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, '${process.env.TOKEN}')
  return token;
}*/
 
// --- on va appliquer dce validator au schéma avant d'en faire un modèle
//userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
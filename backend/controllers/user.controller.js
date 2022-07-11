// IMPORTS
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ObjectId = require('mongoose').Types.ObjectId;

// Obtenir tous les utilisateurs
module.exports.getAllUsers = async (req, res) => {  
  const users = await User.find().select('-password');
  res.status(200).json(users); // on fait transiter en json la data users
}

module.exports.userInfo = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("Id inconnu : " + req.params.id)

  User.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log('Id inconnu:' + err);
  }).select('-password'); // on ne transmet pas le mot de passe
}

module.exports.updateUser = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("Id inconnu : " + req.params.id)

  const updatedUser = {
    bio: req.body.bio
  }
  User.findByIdAndUpdate(
    req.params.id,
    { $set: updatedUser },
    { new: true, upsert: true, setDefaultOnInsert: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("Erreur de mise à jour: " + err);
    }
  )
}

module.exports.deleteUser = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("Id inconnu : " + req.params.id);

  User.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send(docs); // on remonte la doc de ce qui est supprimé
    else console.log('Erreur de suppression : ' + err);
  })
}

// IMPORTS
const Publication = require('../models/publication');

// --- import de filesystem = permet accès aux diff op liées au syst de fichier
const fs = require('fs');


// FONCTIONS

// --- Création d'une publication
exports.createPublication = (req, res, next) => {  
  // --- on a un objet js ss forme de ch de caract = req.body.sauce à analyser
  // --- extraction d'un objet json
const publicationObject = JSON.parse(req.body.publication);

  // --- suppression de l'id spécifique à mongoDB
delete publicationObject._id;

publicationObject.likes = 0;
publicationObject.dislikes = 0;
publicationObject.usersLiked = [];
publicationObject.usersDisliked = [];

  // ---constitution d'un nouvel objet sauce en recopiant toutes les données mais en modifiant 
  // --- l'URL de l'image modifié par notre middleware multer
const publication = new Publication({
  ...publicationObject,

  // --- récupération dynamique des segments nécessaire de l'URL où se trouve l'image. req.protocol 
  // --- = http ou https + récupérer le host de notre server localhost:3000 ici (sinon racine serveur)
  // --- + nom de fichier
  imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
});
publication.save()
  .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
  .catch((error) => res.status(400).json({ error }));
};

// --- Modification d'une publication
exports.updatePublication = (req, res, next) => {
  if (req.file) {
    // si présence nouveau fichier image, on supprime l'ancien fichier (= deletePublication)
    Publication.findOne({ _id: req.params.id })    
      .then((publication) => {
        const filename = publication.imageUrl.split("/images/")[1];
        fs.unlink(`./images/${filename}`, () => {
          const publicationObject = {
            ...JSON.parse(req.body.publication),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`
          };
          Publication.updateOne(
            { _id: req.params.id },
            { ...publicationObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "Publication modifiée!" }))
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    // si pas de fichier image, on prend simplement le corps de la req
    console.log("else");
    const publicationObject = { ...req.body };
    Publication.updateOne(
      { _id: req.params.id },
      { ...publicationObject, _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: "Publication modifiée!" }))
      .catch((error) => res.status(400).json({ error }));
  }
};

// --- Suppression d'une publication
exports.deletePublication = (req, res, next) => {  
  Publication.findOne({ _id: req.params.id })  
    .then(publication => {
      // avec ce thing on veut le nom de fichier précisemment
      // on split autour de /images/ dans le contenu de l'URL image
      // retourne tab de 2 él : 1er él = avant /images/, 2è él = ce 
      // qui vient après = nom du fichier que l'on récupère avec [1]
      const filename = publication.imageUrl.split('/images/')[1];
      // avec le nom de fich, on applique la fonction unlink du pack fs
      // = sup un fich. 1er argt = le fich à sup
      // 2è arg = le callback = ce qu'il faut faire 1 fois le fich sup
      fs.unlink(`./images/${filename}`, (err) => {
        console.log(err);
        // on sup le thing de la bdd
        Publication.deleteOne({ _id: req.params.id })
          .then(() => res.status(204).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// --- Récupération de toutes les publications
exports.readAllPublication = (req, res, next) => {
  Publication.find()
    .then((publications) => {
      res.status(200).json(publications);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// --- Récupération des informations d'une seule publication
exports.readOnePublication = (req, res, next) => {
  Publication.findOne({
    _id: req.params.id
  }).then(
    (publication) => {
      res.status(200).json(publication);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

// --- Ajout likes / dislikes pour chaque publication
exports.likePublication = (req, res) => {

  // --- Si le client Like cette publication
  if (req.body.like === 1) {
    Publication.findOneAndUpdate(
      // --- filtre sur l'id, on incrémente likes et on met l'id ds le tableau
      { _id: req.params.id },
      { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }
    )
      .then(() => res.status(200).json({ message: "Like ajouté !" }))
      .catch((error) => res.status(400).json({ error })); 

  // --- Si le client disike cette publication 
  }else if (req.body.like === -1) {
    // --- filtre sur l'id, on incrémente likes et on met l'id ds le tableau
    Publication.findOneAndUpdate(
        { _id: req.params.id },
        { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } }
      )
        .then(() => res.status(200).json({ message: "Dislike ajouté !" }))
        .catch((error) => res.status(400).json({ error }));
  
  /* Si le client annule son choix */
      } else {
        // --- recherche de la publication concernée par l'id user
        Publication.findOne({ _id: req.params.id })
        .then((resultat) => {
          // --- recherche si le tableau userLike contient l'userId
          // --- si ok on incrémente de -1 le like et on enlève l'userId du tab userLike
          if (resultat.usersLiked.includes(req.body.userId)) {
            Publication.findOneAndUpdate(
              { _id: req.params.id },
              { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
            )
              .then(() => res.status(200).json({ message: "like retiré !" }))
              .catch((error) => res.status(400).json({ error }));

          // --- recherche si le tableau userDislike contient l'userId
          // --- si ok on incrémente de -1 le dislike et on enlève l'userId du tab userDislike
          } else if (resultat.usersDisliked.includes(req.body.userId)) {
            Publication.findOneAndUpdate(
              { _id: req.params.id },
              { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } }
            )
              .then(() => res.status(200).json({ message: "dislike retiré !" }))
              .catch((error) => res.status(400).json({ error }));
          }
        });
      }
}


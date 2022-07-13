// IMPORTS
const Publication = require('../models/publication');

// --- import de filesystem = permet accès aux diff op liées au syst de fichier
const fs = require('fs');


// FONCTIONS

// --- Création d'une publication
exports.createPublication = (req, res, next) => {
  console.log("dans CreatePublication");
  console.log(req.body.userId);
  console.log(req.body.message);
  console.log(req.body.imageUrl);
  const publicationObject = req.body;
  //delete publicationObject._id;    
  publicationObject.likes = 0;
  publicationObject.dislikes = 0;
  publicationObject.usersLiked = [];
  publicationObject.usersDisliked = [];

  publicationObject.userId = req.body.userId;
  publicationObject.message = req.body.message;
  publicationObject.imageUrl = req.body.imageUrl;

  const publication = new Publication({
    ...publicationObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.body.imageUrl}`,
  });

  publication.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch((error) => res.status(400).json({ error }));
};

// --- Modification d'une publication
exports.updatePublication = (req, res, next) => {
  if (req.file) {
    console.log("req.file", req.file);
    // si présence nouveau fichier image, on supprime l'ancien fichier (= deletePublication)
    Publication.findOne({ _id: req.params.id })
      .then(publication => {
        if ((req.userId === publication.userId) || req.isAdmin) {
          const filename = publication.imageUrl.split("/images/")[1];
          fs.unlink(`./images/${filename}`, () => {
            const publicationObject = {
              ...req.body,
              imageUrl: `${req.protocol}://${req.get("host")}/images/${req.body.imageUrl
                }`
            };
            Publication.updateOne(
              { _id: req.params.id },
              { ...publicationObject, _id: req.params.id }
            )
              .then(() => res.status(200).json({ message: "Publication modifiée!" }))
              .catch((error) => res.status(400).json({ error }));
          });
        } else {
          return res.status(403).send("Vous n'avez pas les droits")
        }
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    Publication.findOne({ _id: req.params.id })
      .then(publication => {
        if ((req.userId === publication.userId) || req.isAdmin) {
          // si pas de fichier image, on prend simplement le corps de la req
          console.log("else");
          //const publicationObject = { ...req.body };
          const publicationObject = {...req.body,  imageUrl: `${req.protocol}://${req.get("host")}/images/${req.body.imageUrl}`};
          Publication.updateOne(
            { _id: req.params.id },
            { ...publicationObject, _id: req.params.id }
          )
            .then(() => res.status(200).json(req.imageUrl))//json({ message: "Publication modifiée sans image!" }))
            .catch((error) => res.status(400).json({ error }));
        } else {
          return res.status(403).send("Vous n'avez pas les droits")
        }
      })
  }
}

// --- Suppression d'une publication
exports.deletePublication = (req, res, next) => {
  Publication.findOne({ _id: req.params.id })
    .then(publication => {
      if (req.userId === publication.userId || req.isAdmin) { 
        //.then(publication => {      
        const imageUrl = publication.imageUrl.split('/images/')[1];
        fs.unlink(`./images/${imageUrl}`, (err) => {
          console.log(err);
          Publication.deleteOne({ _id: req.params.id })
            .then(() => res.status(204).json({ message: 'Objet supprimé !' }))
            .catch(error => res.status(400).json({ error }));
        });
        //})
      } else {
        return res.status(403).send("Vous n'avez pas les droits")
      }
    })
    /*.then(publication => {      
      const filename = publication.imageUrl.split('/images/')[1];           
      fs.unlink(`./images/${filename}`, (err) => {
        console.log(err);        
        Publication.deleteOne({ _id: req.params.id })
          .then(() => res.status(204).json({ message: 'Objet supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })*/
    .catch(error => res.status(500).json({ error }));
};

// --- Récupération de toutes les publications
exports.readAllPublication = (req, res, next) => {
  Publication.find().sort({ createdAt: "desc" })
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
  } else if (req.body.like === -1) {
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


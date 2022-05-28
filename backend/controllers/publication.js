// IMPORTS
const Publication = require('../models/publication');
const User = require('../models/user');
const ObjectId = require('mongoose').Types.ObjectId;


// --- import de filesystem = permet accès aux diff op liées au syst de fichier
const fs = require('fs');


// FONCTIONS

// --- Récupération de toutes les publications TYPE 1
// - docs = on met toute la data
/*module.exports.readPublication = (req, res) => {
    Publication.find((err, docs) => {
       if(!err) res.send(docs);
       else console.log('Error to get data : '+err);
    }) 
}*/

// --- Récupération de toutes les publications TYPE 2
exports.readPublication = (req, res, next) => {
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


// --- Création d'une publication TYPE 1
module.exports.createPublication = async (req, res, next) => {

    const newPublication = new Publication({
        posterId: req.body.posterId,
        message: req.body.message,
        video: req.body.video,
        likers: [],
        commentaires: [],
    });
    // --- incrémenter notre data dans mongoDB
    try {
        const publication = await newPublication.save();
        return res.status(201).json(publication);
    }
    catch (err) {
        return res.status(400).send(err);
    }
}

// --- Création d'une publication TYPE 2



// --- Modification d'une publication TYPE 1
/*module.exports.updatePublication = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send("Id inconnu : " + req.params.id);

    const updatedRecord = {
        message: req.body.message
    }

    Publication.findByIdAndUpdate(
        req.params.id,
        { $set: updatedRecord },
        { new: true },
        (err, docs) => {
            if (!err) res.send(docs);
            else console.log("Erreur de mise à jour: " + err);
        }
    )
}*/

// --- Modification d'une publication TYPE 2
exports.updatePublication = (req, res, next) => {
    if (req.file) {
      // si présence nouveau fichier image, on supprime l'ancien fichier (= deleteSauce)
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
        .then(() => res.status(200).json({ message: "Publication modifiée sans image!" }))
        .catch((error) => res.status(400).json({ error }));
    }
  };


// --- Supprimer une publication TYPE 1
module.exports.deletePublication = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send("Id inconnu : " + req.params.id);

    Publication.findByIdAndRemove(req.params.id, (err, docs) => {
        if(!err) res.send(docs);
       else console.log('Erreur de suppression : '+err);
    })
};

// 
/*exports.deletePublication = (req, res, next) => {
    // trouver l'obj à sup de la bdd par son id qui doit correspondre
    // à celui dispo ds les param req
    Publication.findOne({ _id: req.params.id })
    // dans le callback de then, on va récupérer une publication
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
  };*/
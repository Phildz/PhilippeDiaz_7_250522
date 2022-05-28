//--- Création schéma de données publication
const mongoose = require('mongoose');

const publicationSchema = mongoose.Schema(
    {
    posterId: { type: String, required: true },
    message: { type: String, required: true },
    //image: { type: String, required: true },
    //video:{ type: String, required: true },
    likers: { type: [String], required: true },
    commentaires:{type:[{commentaireId:String, texte:String, timestamp:Number}]},
    },
    {
    timestamps:true,
    }    
);

module.exports = mongoose.model('Publication', publicationSchema);
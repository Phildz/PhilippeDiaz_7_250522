//--- Création schéma de données publication
const mongoose = require('mongoose');

const publicationSchema = mongoose.Schema(
    {
    userId: { type: String, required: true },
    message: { type: String, required: true },
    imageUrl: { type: String, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type: Array, required: true },
    usersDisliked: { type: Array, required: true },
    role: {type: String, default: "user"}
    },
    {
    timestamps: true,
    }
);

module.exports = mongoose.model('Publication', publicationSchema);
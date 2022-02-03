const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = Schema({
    name: String,
    bggId: {
        type: String,
        unique: true,
    },
    thumbnail: String,
    image: String,
    playerCount: {
        min: Number,
        max: Number,
        best: String
    },
    playTime: Number,
    category: [String],
    mechanics: [String],
    bggLink: String,
    description: String,
    display: Boolean
});

module.exports = mongoose.model('Game', gameSchema);
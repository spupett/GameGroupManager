const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    name: String,
    bggId: String,
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
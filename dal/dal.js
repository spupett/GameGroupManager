const mongoose = require('mongoose');
require('dotenv/config');

const mongoConnection = process.env.DB_CONNECTION;

module.exports = {
    findOne: (model, userName) => {
        mongoose.connect(mongoConnection, { useNewUrlParser: true });
        return model.findOne({ BGGName: userName }).exec()
            .then((result) => { return result; })
            .catch((error) => { throw error; });

    },

    find: (model, search) => {
        mongoose.connect(mongoConnection, { useNewUrlParser: true });
        return model.find(search).exec()
            .then((result) => { return result; })
            .catch((error) => { throw error; });
    },

    findById: (model, id) => {
        mongoose.connect(mongoConnection, { useNewUrlParser: true});
        return model.findById(id).exec()
            .then((result) => { return result; })
            .catch((error) => { throw error; });
    },

    save: (model) => {
        mongoose.connect(mongoConnection, { useNewUrlParser: true });
        return model.save()
            .then((results) => { return results; })
            .catch((error) => { throw error; });
    },

    update: (model, where, update) => {
        mongoose.connect(mongoConnection, { useNewUrlParser: true });
        return model.findByIdAndUpdate(where, update )
            .then((result) => { return result; })
            .catch((error) => { throw error; });
    },

    delete: (model, userName) => {
        mongoose.connect(mongoConnection, { useNewUrlParser: true });
        return model.deleteOne({ BGGName: userName }).exec()
            .then((results) => { return results; })
            .catch((error) => { throw error; });
    }
}
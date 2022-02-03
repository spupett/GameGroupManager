const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    BGGName: { 
        type: String, 
        unique: true,
        required: true
    },
    email: String,
    favorites: {
        users: [],
        games: [],
        groups: []
    },
    password: {
        type: String,
        required: true
    },
    games: []
});

userSchema.statics.authenticate = function(BGGName, password, callback) {
    User.findOne({BGGName: BGGName})
        .exec(function (err, user) {
            if (err) {
                return callback(err)
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
                bcrypt.compare(password, user.password, function (err, result) {
                if (result === true) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            })
        });
}

// pre-hook to salt the password
userSchema.pre('save', function(next) { // Cannot use arrow function here, messes with `this` for some reason
    const user = this;
    bcrypt.hash(user.password, 10, (err, hash) => {
        if(err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

var User = mongoose.model('User', userSchema);
module.exports = User;
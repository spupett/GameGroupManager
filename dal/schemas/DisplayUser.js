const DisplayUser = {
    model: {
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
        id: String
    },
    map: function(userData) {
        this.model.firstName = userData.firstName;
        this.model.lastName = userData.lastName;
        this.model.BGGName = userData.BGGName;
        this.model.email = userData.email;
        this.model.favorites = userData.favorites;
        this.model.games = userData.games;

        return this.model
    }
};

module.exports = DisplayUser;

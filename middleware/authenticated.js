const authenticated = {

    isAuthenticated: function(req, res, next) {
        if(req.session.userId) {
            return next();
        }
        res.send('You can\'t be here');
    }
}

module.exports = authenticated;
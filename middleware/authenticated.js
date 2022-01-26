const authenticated = {

    isAuthenticated: function(req, res, next) {
        if(req.session.userId) {
            return next();
        }
        res.session('You can\'t be here');
    }
}

module.exports = authenticated;
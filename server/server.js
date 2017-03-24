/* APP REQUIRE */
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let passport = require('passport');
let morgan = require('morgan');
require('../config/passport.config')(passport);

let config = require('../config/config');

/* IMPORT ROUTES */
let authRoutes = require('../routes/auth.routes');
let usersRoutes = require('../routes/users.routes');

/* APP USE */
app.use(bodyParser.json());
if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
}
app.use(passport.initialize());


let authMiddleware = function(req, res, next) {
    passport.authenticate('jwt', { session: false }, function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            res.status(401);
            return res.json({success: false, message: 'Unauthorized'}).end();
        }
        req.currentUser = user;
        next();
    })(req, res, next);
};

/* ROUTES WITHOUT AUTH */
app.use('/api/v1', authRoutes);
/* USERS ROUTES */
app.use('/api/v1/user', authMiddleware, usersRoutes);

module.exports = app;

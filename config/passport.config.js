let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;
let User = require('../models/user.model');
let config = require('./config');

let configPassport = (passport) => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findOne({id: jwt_payload._id}, (err, user) => {
            if(err) return done(err, false);
            if(user) {
                done(null, user)
            } else {
                done(null, false)
            }
        })
    }))
};

module.exports = configPassport;
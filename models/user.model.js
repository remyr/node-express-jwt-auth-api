let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let uniqueValidator = require('mongoose-unique-validator');

let Validators = require('../utils/validators');

mongoose.Promise = global.Promise;

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Field email is required'],
        validate: [Validators.emailValidator, 'Please fill a valid email address'],
        unique: [true, 'This email address already exist'],
    },
    password: {
        type: String,
        required: [true, 'Field password is required'],
        select: false,
    },
    username: String,
    resetPasswordToken: String,
    resetPasswordExpiration: Date
});

UserSchema.pre('save', function(next) {
    let user = this;
    if(!user.isModified('password')) return next();
    bcrypt.genSalt(10, (err, salt) => {
        if(err) return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        })
    })
});
UserSchema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch)
    })
};

UserSchema.plugin(uniqueValidator, { message: 'This {PATH} already exist.' });

module.exports = mongoose.model('User', UserSchema);
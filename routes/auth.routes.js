let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
let crypto = require('crypto');

let config = require('../config/config');

let User = require('../models/user.model');
let errorsFormatter = require('../utils/errorsFormatter');

/**
 * @api {post} /api/v1/register Create an account
 * @apiName Register
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 *
 * @apiParam {String} email Email
 * @apiParam {String} password Password
 */
router.post('/register', (req, res) => {
    let user = new User({
        email: req.body.email,
        password: req.body.password,
    });
    user.save((err) => {
        if (err) {
            res.status(400);
            return res.json({success: false, errors: errorsFormatter(err.errors)});
        }
        res.json({success: true, message: 'Successfully created new user.'})
    })
});

/**
 * @api {post} /api/v1/login Login a user and get a JWT Token
 * @apiName Login
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 *
 * @apiParam {String} email Email
 * @apiParam {String} password Password
 */
router.post('/login', (req, res) => {
    if(!req.body.email || !req.body.password) {
        res.status(400);
        return res.json({success: false, message: 'Please provide username and/or password'})
    }
    User.findOne({email: req.body.email}).select('+password').exec((err, user) => {
        if(!user) {
            res.status(401);
            return res.json({success: false, message: 'Authentication failed, User not found'});
        }
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (isMatch && !err) {
                let userObject = {id: user.id, email: user.email};
                let token = jwt.sign(userObject, config.secret, {expiresIn: 3600});
                return res.json({success: true, token: `JWT ${token}`})
            } else {
                res.status(401);
                res.json({success: false, message: 'Authentication failed'})
            }
        })
    })
});

/**
 * @api {post} /api/v1/forgot-password Get token to reset password
 * @apiName Forgot Password
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 *
 * @apiParam {String} email Email
 */
router.post('/forgot-password', (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if(err) {
            res.status(400);
            return res.json({success: false, errors: errorsFormatter(err.errors)});
        }
        if(!user) {
            res.status(400);
            return res.json({success: false, message: 'No account with that email address exists'});
        }
        crypto.randomBytes(20, (err, buf) => {
            let token =  buf.toString('hex');
            user.resetPasswordToken = token;
            user.resetPasswordExpiration = Date.now() + 3600000; // Reset password token valid 1 hour
            user.save((err) => {
                if(err) return res.json({success: false, message: 'Updating user error'});
                /* TODO SEND EMAIL TO USER */
                return res.json({success: true, resetPasswordToken: token})
            })
        })
    })
});

/**
 * @api {post} /api/v1/reset-password/:token Reset password
 * @apiName Reset Password
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 *
 * @apiParam {String} token Reset token
 *
 * @apiParam {String} password Password
 * @apiParam {String} confirmPassword Confirm Password
 */
router.post('/reset-password/:token', (req, res) => {
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpiration: {$gt: Date.now()} }, (err, user) => {
        if(!user) {
            res.status(400);
            return res.json({success: false, message: 'Password reset token is invalid or has expired'});
        }
        if(req.body.password !== req.body.confirmPassword) {
            res.status(400);
            return res.json({success: false, message: 'Passwords must be identical'});
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiration = undefined;

        user.save((err) => {
            if (err) return res.json({success: false, message: 'Updating password error'});
            return res.json({success: true, message: 'Password successfully update'})
        })
    })
});

module.exports = router;
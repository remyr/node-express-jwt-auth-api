let express = require('express');
let router = express.Router();

let User = require('../models/user.model');

/**
 * @api {get} /api/v1/user/ Current user information
 * @apiName Get current user
 * @apiGroup User
 * @apiVersion 1.0.0
 */
router.get('/', (req, res) => {
   User.findOne({_id: req.currentUser._id}, (err, user) => {
       if(!user) {
           res.status(401);
           res.json({success: false, message: 'User not found'})
       }
       res.json({success: true, user: user})
   })
});

/**
 * @api {put} /api/v1/user Modify current user
 * @apiName Modify user
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiParam {String} field Field to update
 */
router.put('/', (req, res) => {
    User.findOneAndUpdate({_id: req.currentUser._id}, { $set: req.body }, {new: true}, (err, user) => {
        res.status(200);
        res.json({success: true, user: user})
    })
});

/**
 * @api {put} /api/v1/user/change-password Change password
 * @apiName Change Password
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiParam {String} password Password
 * @apiParam {String} confirmPassword Confirm Password
 */
router.put('/change-password', (req, res) => {
    if(req.body.password != req.body.confirmPassword) {
        res.status(400);
        return res.json({success: false, message: 'Passwords must be identical'})
    }
    User.findOne({_id: req.currentUser._id}, (err, user) => {
        user.password = req.body.password;
        user.save((err, user) => {
            res.status(200);
            res.json({success: true, message: 'Password successfully update'})
        })
    })
});

module.exports = router;
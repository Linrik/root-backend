const express = require('express'),
      router = express.Router(),
      User = require('../config/userSchema'),
      passport = require('passport'),
      session = require('express-session'),
      mongoose = require('mongoose'),
      isAdmin = require('./AuthMiddelware').isAdmin
// laget api til å gi å fjerne rolle med en admin sjekk
// gi root rolle
router.route('/rootMedlem')
    // gi rootmedlem
    .put(async (req, res, next)=>{
        await User.updateOne({email: req.body.email}, {rootMember: true})
        await 
        console.log()
        next()
    })
    // fjern rolle
    .delete(async (req, res, next)=>{
        await User.updateOne({email: req.body.email}, {$set: {rootMember: false}})
        next()
    })
// gi admin rolle
router.route('/admin')
    // gi admin
    .put(async (req, res, next)=>{
        await User.updateOne({email: req.body.email}, {admin: true})
        next()
    })
    // fjern rolle
    .delete(async (req, res, next)=>{
        await User.updateOne({email: req.body.email}, {$set: {admin: false}})
        next()
    })
    module.exports = router;

    // må få endret session til folk når man endrer roller 
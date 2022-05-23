const express = require('express'),
      router = express.Router(),
      User = require('../config/userSchema'),
      Langstatic = require('../config/langStatSchema'),
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
        next()
    })
// fjern rolle
    .delete(async (req, res, next)=>{
        await User.updateOne({email: req.body.email}, {$set: {rootMember: false}})
        next()
    })
// gi admin rolle
router.route('/admin')
    .put(async (req, res, next)=>{
        await User.updateOne({email: req.body.email}, {admin: true})
        next()
    })
    // fjern rolle
    .delete(async (req, res, next)=>{
        await User.updateOne({email: req.body.email}, {$set: {admin: false}})
        next()
    })

router.route('/editor')
    .put(async (req, res, next)=>{
        await User.updateOne({email: req.body.email}, {editor: true})
        next()
    })
    // fjern rolle
    .delete(async (req, res, next)=>{
        await User.updateOne({email: req.body.email}, {$set: {editor: false}})
        next()
    })

module.exports = router;

// må få endret session til folk når man endrer roller 
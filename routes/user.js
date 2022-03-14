const express = require('express'),
      router = express.Router(),
      User = require('../config/userSchema'),
      passport = require('passport'),
      session = require('express-session'),
      mongoose = require('mongoose')

// laget api som registrerer bruker med encryptet hash passord
router.route('/signup')
    .post(async (req, res, next) => {
        //registrer bruker
        const nyBruker = new User({
            email: req.body.email.toLowerCase(),
            name: req.body.name,
            password: req.body.password,
        })
        await nyBruker.save((err)=>{
            if(err) return err;
            console.log("Bruker ble registrert")
        })
        next()
    })

// laget login som bruker localstrategy fra passport
router.route('/')
    //login (funker men vil se litt mer på)
    .post(passport.authenticate('local'), (req, res, next) => {next()})
    // endre på bruker (ikke ferdig)
    .put(async (req, res, next) => {
        await User.updateOne({email: req.user.email}, {email: req.body.email})
        req.session.passport.user.email = req.body.email
        next()
    })
    // slett bruker (ikke ferdig)
    .delete((res, req, next) => {
        req.logout()
        req.session.destroy()
        next()
    })
    //laget logg ut funksjon til bruker
    // logge ut. (ferdig)
    router.route('/logout')
    .post((req,res,next)=>{
        req.logout()
        req.session.destroy()
        res.clearCookie('neo', {path: '/'}).status(200).send('Ok.');
        next()
    })

module.exports = router;
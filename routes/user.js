const express = require('express'),
      router = express.Router(),
      User = require('../config/userSchema'),
      passport = require('passport'),
      session = require('express-session'),
      mongoose = require('mongoose')

const conn = process.env.DB_STRING;

router.route('/signup')
    .post(async (req, res, next) => {
        //registrer bruker
        const nyBruker = new User({
            email: req.body.email,
            password: req.body.password,
        })
        await nyBruker.save((err)=>{
            if(err) return err;
            console.log("Bruker ble registrert")
        })
        next()
    })

router.route('/')
        //login
    .post(passport.authenticate('local'), (req, res, next) => {next()})
    .put(async (req, res, next) => {
        
        await User.updateOne({email: req.user.email}, {email: req.body.email})
        req.session.passport.user.email = req.body.email
        next()
    })
    .delete((res, req, next) => {
        req.logout()
        req.session.destroy()
        next()
    })
    router.route('/logout')
    .post((req,res,next)=>{
        req.logout()
        req.session.destroy()
        next()
    })

module.exports = router;
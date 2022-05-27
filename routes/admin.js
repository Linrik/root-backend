const express = require('express'),
      router = express.Router(),
      User = require('../config/userSchema'),
      Langstatic = require('../config/langStatSchema'),
      logger = require('../config/logger'),
      loggerMid = require('./logMiddleware'),
      passport = require('passport'),
      session = require('express-session'),
      mongoose = require('mongoose'),
      isAdmin = require('./AuthMiddelware').isAdmin
// laget api til å gi å fjerne rolle med en admin sjekk
// gi root rolle
router.route('/rootmedlem')
    // gi rootmedlem
    .put(async (req, res, next)=>{
        await User.updateOne({email: req.body.email}, {rootMember: true})
        res.locals.level = 'info'
        res.locals.message = `Admin ga root medlem rettigheter til ${req.body.email}`
        next()
    })
// fjern rolle
    .delete(async (req, res, next)=>{
        await User.updateOne({email: req.body.email}, {$set: {rootMember: false}})
        res.locals.level = 'info'
        res.locals.message = `Admin fjermet root medlem rettigheter til ${req.body.email}`
        next()
    })
// gi admin rolle
router.route('/admin')
    .put(async (req, res, next)=>{
        await User.updateOne({email: req.body.email}, {admin: true})
        res.locals.level = 'info'
        res.locals.message = `Admin ga admin rettigheter til ${req.body.email}`
        next()
    })
    // fjern rolle
    .delete(async (req, res, next)=>{
        await User.updateOne({email: req.body.email}, {$set: {admin: false}})
        res.locals.level = 'info'
        res.locals.message = `Admin fjernet admin rettigheter til ${req.body.email}`
        next()
    })

router.route('/editor')
    .put(async (req, res, next)=>{
        await User.updateOne({email: req.body.email}, {editor: true})
        res.locals.level = 'info'
        res.locals.message = `Admin ga editor rettigheter til ${req.body.email}`
        next()
    })
    // fjern rolle
    .delete(async (req, res, next)=>{
        await User.updateOne({email: req.body.email}, {$set: {editor: false}})
        res.locals.level = 'info'
        res.locals.message = `Admin fjernet editor rettigheter til ${req.body.email}`
        next()
    })
router.route('/log/:state')
    // skru avog på logging
    .put(async (req, res, next)=>{
        if(req.params.state === 'on'){
            logger.configure({
                silent: false
            })
            res.json('Skrudd på logging')
        } else if(req.params.state ===  'off'){
            logger.configure({
                silent: true
            })
            res.json('Skrudd av logging')
        }
        next()
    })
    .get(async (req, res, next)=>{
        const status = {
            logger: logger.silent,
            level: logger.level
        }
        res.json(status)
        next()
    })
    .post(async (req, res, next)=>{
        logger.configure({
            level: req.body.level
        })
        res.json(`endret nivå til ${req.body.level}`)
        next()
    })
    

module.exports = router;

// må få endret session til folk når man endrer roller 
const express = require('express'),
      router = express.Router(),
      Event = require('../config/eventSchema'),
      comment = require('./comment'),
      User = require('../config/userSchema'),
      { isAdmin, isUser, isRoot, isEditor } = require('../routes/AuthMiddelware');

router.route('/')
    .get(async (req, res, next)=>{
        const events = await Event.find({}).sort({dateFrom: 1})
        .populate('user', 'firstname lastname')
        .populate('participants', 'firstname lastname')
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: 'firstname lastname'
            }
        })
        res.json(events)
        next()
    })
    .post( isEditor, async (req, res, next)=>{
        const nyEvent = new Event({
            user: await User.findOne({  _id: req.session.passport.user.id}),
            title: req.body.title,
            description: req.body.description,
            dateFrom: req.body.dateFrom,
            dateTo: req.body.dateTo
        })
        nyEvent.save((err) =>{
            if(err){
                res.locals.level = 'error'
                res.locals.message = 'feil under lagring av event'
                next()
                return err
            }
            res.locals.level = 'info'
            res.locals.message = 'Event laget'
            next()
        })
        res.json({status: 200})
        
    })
    .put(isEditor, async (req, res, next) =>{
        await Event.updateOne({_id: req.body.eventid}, 
            {
                title: req.body.title,
                description: req.body.description,
                dateFrom: req.body.dateFrom,
                dateTo: req.body.dateTo
            })
        res.locals.level = 'info'
        res.locals.message = 'Event endret'
        res.json({status: 200})
        next()
    })
    .delete(isEditor, async (req, res, next)=>{
        await Event.deleteOne({_id: req.body.eventid})
        res.locals.level = 'info'
        res.locals.message = 'Event slettet'
        next()
    })

    router.route('/:id')
        .get(async (req, res, next)=>{
           await Event.findById({_id: req.params.id}, (err, doc) =>{
                if(err){
                    res.locals.level = 'info'
                    res.locals.message = 'Event ikke funnet'
                    next()
                    return res.json("Event ikke funnet")
                } 
                res.json(doc)
            })
        })

    router.route('/participants')
        .get(isUser, async (req,res,next)=>{
            Event.find({participants: req.session.passport.user.id}, (err, doc)=>{
                if(err) return err
                res.json(doc)
            })
        })
        .put(isUser, async (req, res, next)=>{
            await Event.updateOne(
                {_id: req.body.eventid},
                {$push: {participants: await User.findById(req.session.passport.user.id)}}
            )
            res.locals.level = 'info'
            res.locals.message = 'Bruker meldte seg på event'
            next()
        })
        .delete(isUser, async (req, res, next)=>{
            await Event.updateOne(
                {_id: req.body.eventid},
                {$pull: {participants: req.session.passport.user.id}}
            )
            res.locals.level = 'info'
            res.locals.message = 'Bruker meldte seg av event'
            next()
        })

//Router.route('/comment', comment)
module.exports = router
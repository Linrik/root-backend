const express = require('express'),
      router = express.Router(),
      Event = require('../config/eventSchema'),
      comment = require('./comment'),
      User = require('../config/userSchema'),
      { isAdmin, isUser, isRoot, isEditor } = require('../routes/AuthMiddelware');

router.route('/')
    .get(async (req, res, next)=>{
        const events = await  Event.find({}).sort({dateFrom: 1})
        res.json(events)
        next()
    })
    .post( isEditor, async (req, res, next)=>{
        const nyEvent = new Event({
            poster: await User.findOne({  _id: req.session.passport.user.id}),
            tittel: req.body.tittel,
            text: req.body.text,
            dateFrom: req.body.dateFrom,
            dateTo: req.body.dateTo,
            bilde: req.body.bilde
        })
        await nyEvent.save((err) =>{
            if(err) return err
            console.log("Event ble registrert")
        })
        next()
    })
    .put(isEditor, async (req, res, next) =>{
        await Event.updateOne({_id: req.body.eventid}, 
            {
                tittel: req.body.tittel,
                text: req.body.text,
                dateFrom: req.body.dateFrom,
                dateTo: req.body.dateTo
            })
        next()
    })
    .delete(isEditor, async (req, res, next)=>{
        await Event.deleteOne({_id: req.body.eventid})
        next()
    })

    router.route('/:id')
        .get(async (req, res, next)=>{
           await Event.findById({_id: req.params.id}, (err, doc) =>{
                if(err) return res.json("Event ikke funnet")
                res.json(doc)
            })
        })

    router.route('/participants')
        .put(isUser, async (req, res, next)=>{
            await Event.updateOne(
                {_id: req.body.eventid},
                {$push: {participants: await User.findById(req.session.passport.user.id)}}
            )
            next()
        })
        .delete(isUser, async (req, res, next)=>{
            await Event.updateOne(
                {_id: req.body.eventid},
                {$pull: {participants: req.session.passport.user.id}}
            )
            next()
        })

//Router.route('/comment', comment)
module.exports = router
//sjekk løsninger på poster
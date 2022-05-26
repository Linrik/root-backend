const express = require('express'),
      router = express.Router(),
      Event = require('../config/eventSchema'),
      comment = require('./comment'),
      User = require('../config/userSchema'),
      { isAdmin, isUser, isRoot, isEditor } = require('../routes/AuthMiddelware'),
      {upload} = require('../config/storageSetup');


router.route('/')
    .get(async (req, res, next)=>{
        const events = await Event.find({}).sort({dateFrom: 1})
        .populate('user', 'name')
        .populate('participants', 'name')
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: 'name'
            },
        })
        res.json(events)
        next()
    })
    .post( isEditor, upload.single('image'), async (req, res)=>{
        console.log(req.body)
        console.log(req.body.image.name)
        const nyEvent = new Event({
            user: await User.findOne({  _id: req.session.passport.user.id}),
            title: req.body.title,
            description: req.body.description,
            dateFrom: req.body.dateFrom,
            dateTo: req.body.dateTo
        })
        await nyEvent.save((err) =>{
            if(err) return err
            console.log("Event ble registrert")
        })
        // next()
        res.json({status: 200})
    })
    .put(isEditor, upload.single('file'), async (req, res, next) =>{
        await Event.updateOne({_id: req.body.eventid}, 
            {
                title: req.body.title,
                description: req.body.description,
                dateFrom: req.body.dateFrom,
                dateTo: req.body.dateTo
            })
        res.json({status: 200})
        next()
    })
    .delete(isEditor, async (req, res, next)=>{
        await Event.deleteOne({_id: req.body.eventid})
        // next()
        res.json({status: 200})
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
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
    .post( isEditor, upload.single('image'), async (req, res)=>{
        console.log(req.body)
        console.log(typeof req.file) 
        const nyEvent = new Event({
            user: await User.findOne({  _id: req.session.passport.user.id}),
            title: req.body.title,
            description: req.body.description,
            dateFrom: req.body.dateFrom,
            dateTo: req.body.dateTo
        })
        nyEvent.save((err, doc) =>{
            if(err){
                res.locals.level = 'error'
                res.locals.message = `feil under lagring av event ${err}`
                //next()
                return err
            }
            res.locals.level = 'info'
            res.locals.message = `Event laget ${doc}`
            //next()
        })
        res.json({status: 200})
        
    })
    .put(isEditor, upload.single('file'), async (req, res, next) =>{
        Event.findById({_id: req.body.eventid}, async (err, doc)=>{
            if(err){
                res.locals.level = 'error'
                res.locals.message = `Noe gikk galt ${err}`
                next()
                return err
            }
            doc.overwrite({
                title: req.body.title,
                description: req.body.description,
                dateFrom: req.body.dateFrom,
                dateTo: req.body.dateTo
            })
            await doc.save((err, change)=>{
                if(err){
                    res.locals.level = 'error'
                    res.locals.message = `Feil under endring av event ${err}`
                    next()
                    return err
                }
                res.locals.level = 'info'
                res.locals.message = `Event endret ${change}`
                next()
            })
        })
    })
    .delete(isEditor, async (req, res, next)=>{
         Event.findById({_id: req.body.eventid}, async (err, doc)=>{
            if(err){
                res.locals.level = 'error'
                res.locals.message = `Noe gikk galt ${err}`
                next()
                return err
            }
            res.locals.level = 'info'
            res.locals.message = `Event slettet ${doc}`
            await Event.deleteOne({_id: req.body.eventid})
            res.json({status: 200})
            next()
        })
    })

    router.route('/id/:id')
        .get(async (req, res, next)=>{
           await Event.findById({_id: req.params.id}, (err, doc) =>{
                if(err){
                    res.locals.level = 'info'
                    res.locals.message = `Event ikke funnet ${err}`
                    next()
                    return res.json("Event ikke funnet")
                } 
                res.json(doc)
            })
        })

    router.route('/participants')
        .get(async (req,res,next)=>{
            const events = await Event.find({participants: req.session.passport.user.id}).sort({dateFrom: 1})
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
        .put(isUser, async (req, res, next)=>{
           const event = await Event.findByIdAndUpdate({_id: req.body.eventid}, 
                {$push: {participants: req.session.passport.user.id}})

                res.locals.level = 'info'
                res.locals.message = `Bruker meldte seg på event ${event}`
                next()
        })
        .delete(isUser, async (req, res, next)=>{
            try {
                const event = await Event.findByIdAndUpdate({_id: req.body.eventid}, 
                    {$pull: {participants:req.session.passport.user.id}})
                    res.locals.level = 'info'
                    res.locals.message = `Bruker meldte seg av event ${event}`
                res.json({status: 200})
            } catch(error){
                err = true;
                res.json({status: 500})
            }
            next()
        })
        

//Router.route('/comment', comment)
module.exports = router
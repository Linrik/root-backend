const express = require('express'),
      router = express.Router(),
      Event = require('../config/eventSchema'),
      User = require('../config/userSchema'),
      { isUser, isEditor } = require('../routes/AuthMiddelware'),
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
    .post(upload.single('image'), isEditor, async (req, res, next)=>{
        let nyEvent;
        if(req.file===undefined){
            nyEvent = new Event({
                user: await User.findOne({  _id: req.session.passport.user.id}),
                title: req.body.title,
                description: req.body.description,
                address: req.body.address,
                dateFrom: req.body.dateFrom,
                dateTo: req.body.dateTo
            })
        } else {
            nyEvent = new Event({
                user: await User.findOne({  _id: req.session.passport.user.id}),
                title: req.body.title,
                description: req.body.description,
                address: req.body.address,
                dateFrom: req.body.dateFrom,
                dateTo: req.body.dateTo,
                image: req.file.filename
            })    
        }
        
        nyEvent.save((err, doc) =>{
            if(err){
                res.locals.level = 'error'
                res.locals.message = `feil under lagring av event ${err}`
                next()
                return res.json({status:210})
            }
            res.locals.level = 'info'
            res.locals.message = `Event laget ${doc}`
            next()
        })
        res.json({status: 200})
    })
    .put(upload.single('image'), isEditor, async (req, res, next) =>{
        Event.findById({_id: req.body.eventid}, async (err, doc)=>{
            if(err){
                res.locals.level = 'error'
                res.locals.message = `Noe gikk galt ${err}`
                next()
                return res.json({status:210})
            }
            let dataToPut = {
                title: req.body.title,
                description: req.body.description,
                address: req.body.address,
                dateFrom: req.body.dateFrom,
                dateTo: req.body.dateTo,
                postedAt: doc.postedAt,
            }
            if(req.file!== undefined){
                dataToPut = Object.assign(dataToPut, {image: req.file.filename})
            } else if(doc.image!==undefined) {
                dataToPut = Object.assign(dataToPut, {image: doc.image})
            }
            doc.overwrite(dataToPut)
            await doc.save((err, change)=>{
                if(err){
                    res.locals.level = 'error'
                    res.locals.message = `Feil under endring av event ${err}`
                    next()
                    return res.json({status:210})
                }
                res.locals.level = 'info'
                res.locals.message = `Event endret ${change}`
                res.json({status:200})
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
                return res.json({status:210})
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
//            await Event.findById({_id: req.params.id}, (err, doc) =>{
//                 if(err){
//                     res.locals.level = 'info'
//                     res.locals.message = `Event ikke funnet ${err}`
//                     next()
//                     return res.json({status:210})
//                 } 
//                 res.json(doc)
//             })
                 
           const event = await Event.findById({_id: req.params.id})
            .populate( 'user', 'firstname lastname')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'firstname lastname',
                }
            })
            res.json(event)
            next()
        })

    router.route('/participants')
        .get(async (req,res,next)=>{
            if(req.isAuthenticated && req.session.passport!==undefined){
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
                return;
            }
            res.json([])
        })
        .put(isUser, (req, res, next)=>{
            Event.findById({_id: req.body.eventid}, (err, doc)=>{
                if(err){
                    res.locals.level = 'error'
                    res.locals.message = `det skjedde noe galt under påmelding ${err}`
                    next()
                    return res.json({status:210})
                }
                if(doc.participants.indexOf(req.session.passport.user.id) === -1){
                    doc.participants.push(req.session.passport.user.id)
                    doc.save()
                    res.locals.level = 'info'
                    res.locals.message = `Bruker meldte seg på event ${doc}`
                    res.json({status:200})
                    next()
                } else {
                    res.json({status:210})
                }
            })
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
        

module.exports = router

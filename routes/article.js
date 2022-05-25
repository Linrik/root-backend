const { isEditor } = require('./AuthMiddelware');

const express = require('express'),
      router = express.Router(),
      User = require('../config/userSchema'),
      passport = require('passport'),
      Article = require('../config/articleSchema')
// laget api som registrerer bruker med encryptet hash passord
router.route('/')
    .post(isEditor, async (req, res, next) => {
        const newArticle = new Article({
            user: await User.findOne({  _id: req.session.passport.user.id}),
            title: req.body.title,
            description: req.body.description,
            image: req.body.image
        })
        await newArticle.save((err, doc) =>{
            if(err){
                res.locals.level = 'error'
                res.locals.message = `Noe gikk galt under lagring av artikkel ${err}`
                next()
                return err;
            }
            res.locals.level = 'info'
            res.locals.message = `Artikkel lagret ${doc}` 
            next()
        })
    })
    .get(async (req, res, next)=>{
        const articles = await Article.find({}).sort({postedAt: -1})
        .populate( 'user', 'firstname lastname')
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: 'firstname lastname'
            }
        })
        res.json(articles)
        next()
    })
    .put(isEditor, async (req, res, next) =>{
        Article.findById({_id: req.body.articleid}, async (err, doc)=>{
            if(err){
                res.locals.level = 'error'
                res.locals.message = `Noe gikk galt ${err}`
                next()
                return err
            }
            doc.overwrite({
                title: req.body.title,
                description: req.body.description,
                image: req.body.image
            })
            await doc.save((err, change)=>{
                if(err){
                    res.locals.level = 'info'
                    res.locals.message = `Event endret ${err}`
                    next()
                    return err
                }
                res.locals.level = 'info'
                res.locals.message = `Event endret ${change}`
                res.json({status: 200})
                next()
            })
            
        })/*
        await Article.updateOne({_id: req.body.articleid}, 
            {
                title: req.body.title,
                description: req.body.description,
                image: req.body.image
            }, (err, doc)=>{
                res.locals.level = 'info'
                res.locals.message = `Artikkel endret ${doc}`
                next()
            })*/
    })
    .delete(isEditor, async (req, res, next)=>{
        Article.findById({_id: req.body.articleid}, async (err, doc)=>{
            if(err){
                res.locals.level = 'error'
                res.locals.message = `Noe gikk galt ${err}`
                next()
                return err
            }
            res.locals.level = 'info'
            res.locals.message = `Event slettet ${doc}`
            await Article.deleteOne({_id: req.body.articleid})
            res.json({status: 200})
            next()
        })
    })

    router.route('/:id')
        .get(async (req, res, next)=>{
           await Article.findById({_id: req.params.id}, (err, doc) =>{
                if(err) return res.json("Artikkel ikke funnet")
                res.json(doc)
            })
        })
    module.exports = router
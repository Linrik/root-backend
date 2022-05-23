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
            tittel: req.body.tittel,
            description: req.body.description,
            image: req.body.image
        })
        await newArticle.save((err) =>{
            if(err) return err;
            console.log("Artikkel ble registrert")
        })
        next()
    })
    .get(async (req, res, next)=>{
        const articles = await Article.find({}).sort({postedAt: -1})
        .populate('user', 'name')
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: 'name'
            },
        })
        res.json(articles)
        next()
    })
    .put(isEditor, async (req, res, next) =>{
        await Article.updateOne({_id: req.body.articletid}, 
            {
                tittel: req.body.tittel,
                description: req.body.description,
                image: req.body.image
            })
    })
    .delete(isEditor, async (req, res, next)=>{
        await Article.deleteOne({_id: req.body.articleid})
        next()
    })

    router.route('/:id')
        .get(async (req, res, next)=>{
           await Article.findById({_id: req.params.id}, (err, doc) =>{
                if(err) return res.json("Artikkel ikke funnet")
                res.json(doc)
            })
        })
    module.exports = router
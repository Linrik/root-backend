const express = require('express'),
      router = express.Router(),
      User = require('../config/userSchema'),
      passport = require('passport'),
      Article = require('../config/articleSchema')
    
// laget api som registrerer bruker med encryptet hash passord
router.route('/')
    .post(async (req, res, next) => {
        const newArticle = new Article({
            poster: await User.findOne({  _id: req.session.passport.user.id}),
            tittel: req.body.tittel,
            text: req.body.text,
            image: req.body.bilde
        })
        await newArticle.save((err) =>{
            if(err) return err;
            console.log("Artikkel ble registrert")
        })
        next()
    })
    .get(async (req, res, next) =>{
        
    })
    .put(async (req, res, next) =>{
        const article = new Article({
            tittel: req.body.tittel,
            text: req.body.text,
            image: req.body.bilde
        })
        await Article.findByIdAndUpdate(req.body.postid, {article})
    })
    .delete(async (req, res, next)=>{
        await Article.findById(req.body.postid, function(err){
            if (err){
                return err;
            }
            article.deleteOne({_id: req.body.postid})
        })
    })
    module.exports = router
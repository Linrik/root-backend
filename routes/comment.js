
const express = require('express'),
      router = express.Router(),
      Comment = require('../config/commentSchema'),
      User = require('../config/userSchema')
// skjer inne i event og artikkel
router.route('/comment')
    .post(async (req, res, next) =>{
        const comment = new Comment({
            user: await User.findById(req),//bruker cookie sin user referanse id
            comment: req.body.comment
        })
    })
    .put(async (req, res, next) => {
        Comment.findOne({_id: req.body.commentid}).then((comment)=>{ //kan lage metode for å verifisere brukeren til kommentaren
            User.findOne({user: comment.user}).then(async (user)=>{
                if(comment.user === user){
                    await Comment.updateOne({comment: comment._id},
                        {comment: req.body.newComment})
                } else{ return done(null, false)}//fikse opp i bedre tilbakemelding
            })
        })
        next()
    })
    .delete(async (req, res, next)=>{
        Comment.findOne({_id: req.body.commentid}).then((comment)=>{
            User.findOne({user: comment.user}).then(async(user)=>{
                if(comment.user === user){
                    await Comment.deleteOne({comment: comment._id})
                } else{ return done(null, false)}//fikse opp i bedre tilbakemelding
            })
        })
        next()
    })
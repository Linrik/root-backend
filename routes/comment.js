const { rawListeners } = require('../config/userSchema');

const express = require('express'),
      router = express.Router(),
      Comment = require('../config/commentSchema'),
      User = require('../config/userSchema'),
      Event = require('../config/eventSchema'),
      Article = require('../config/articleSchema'),
      { isAdmin, isUser, isRoot, isEditor } = require('../routes/AuthMiddelware');
router.route('/:type')
    .post(async (req, res, next) =>{
        const comment = new Comment({
            user: await User.findById({_id: req.session.passport.user.id}),//bruker cookie sin user referanse id
            comment: req.body.comment
        })
        await comment.save((err)=>{
            if(err) return res.json(err)
        })
        if(req.params.type === 'event'){
        await Event.updateOne({_id: req.body.postid},
            {$push: {comments: comment}} )
        } else if(req.params.type === 'article'){
            await Article.updateOne({_id: req.body.postid},
                {$push: {comments: comment}} )
        }
        next()
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
    .delete(isUser, async (req, res, next)=>{
        const comment = await Comment.findById({_id: req.body.commentid})
        console.log(comment)
        if(req.session.passport.user.id == comment.user){
            if(req.params.type === 'event'){
                await Event.updateOne(
                    {_id: req.body.postid},
                    {$pull: {comments: req.body.commentid}} 
                )
            } else if(req.params.type === 'article'){
                await Article.updateOne(
                    {_id: req.body.postid},
                    {$pull: {comments: req.body.commentid}}
                )
            }
            await Comment.deleteOne({_id: req.body.commentid})
        }
        next()
    })
        

    module.exports = router
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
            if(err){
                res.locals.level = 'info'
                res.locals.message = `skjedde feil under lagring av kommentar ${err}`
                next()
                return res.json(err)
            } 
        })
        if(req.params.type === 'event'){
            await Event.updateOne({_id: req.body.postid},
                {$push: {comments: comment}} )
                res.locals.level = 'info'
                res.locals.message = `Bruker har kommentert på event ${comment}`
                next()
        } else if(req.params.type === 'article'){
            await Article.updateOne({_id: req.body.postid},
                {$push: {comments: comment}} )
                res.locals.level = 'info'
                res.locals.message = `Bruker har kommentert på artikkel ${comment}`
                next()
        }
    })
    .put(async (req, res, next) => {
        Comment.findOne({_id: req.body.commentid}).then((comment)=>{ 
            User.findOne({user: comment.user}).then(async (user)=>{
                if(comment.user === req.session.passport.user){
                    await Comment.updateOne({comment: comment._id},
                        {comment: req.body.newComment})
                        res.locals.level = 'info'
                        res.locals.message = `Bruker har endret kommentar ${req.body.newComment}`
                        next()
                } else{ 
                    res.locals.level = 'info'
                    res.locals.message = `Kan ikke endre andres kommentarer`
                    next()
                    return done(null, false)
                }
            })
        })
        
    })
    .delete(isUser, async (req, res, next)=>{
        const comment = await Comment.findById({_id: req.body.commentid})
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
            await Comment.deleteOne({_id: req.body.commentid}, (err, doc)=>{
                res.locals.level = 'info'
                res.locals.message = `Bruker slettet komentaren sin ${doc}`
                next()
            })  
        }
    })
        

    module.exports = router
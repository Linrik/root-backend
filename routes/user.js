const express = require('express'),
      router = express.Router(),
      User = require('../config/userSchema'),
      passport = require('passport'),
      bcrypt = require('bcrypt'),
      logger = require('../config/logger'),
      { isAdmin, isUser, isRoot, isEditor } = require('../routes/AuthMiddelware')

const mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<;>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const isEmail = (email)=> {
    return email.match(mailRegex)
}

// laget api som registrerer bruker med encryptet hash passord
router.route('/signup')
    .post(async (req, res, next) => {
        if(isEmail(req.body.email.toLowerCase())){
            //registrer bruker
            const nyBruker = new User({
                email: req.body.email.toLowerCase(),
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                password: req.body.password,
            })
            await nyBruker.save((err, doc)=>{
                if(err)return res.json("E-post allerede i bruk")
               
                res.locals.level = 'info'
                res.locals.email = req.body.email
                res.locals.message = `Bruker ble registrert ${doc}`
                req.login(nyBruker, function(err) {
                if (err) { return next(err); }
                    res.redirect('/');
                    next()
                });
                
            })
        } else{
            res.json("Ugyldig Email")
        }
    })

router.route('/')
//sender brukerdata når de er logget inn
    .get((req, res, next)=>{
        if(req.session.passport===undefined){
            res.json({loginStatus:false});
        } else {
            res.json({
                loginStatus:true,
                user: req.session.passport.user
            })
        }
    })
    //login som bruker localstrategy fra passport
    .post(passport.authenticate('local'), (req, res, next) => {
        res.json({
            loginStatus:true,
            user:req.session.passport.user
        })
        next()
    })
    // endre på bruker (ferdig, men må testes)
    .put(isUser, async (req, res, next) => {
        User.findOne({ email: req.session.passport.user.email}).select("+password").then((user) => {  
            if (!user) {
                res.locals.level = 'error'
                res.locals.message = `fant ikke brukeren ${user}`
                res.json({status:210})
                next()
                return done(null, false); 
                }
            bcrypt.compare(req.body.password, user.password, async function(err, isMatch) {
                if(err){
                    res.locals.level = 'error'
                    res.locals.message = `skjedde en feil under sammenligning av passord ${err}`
                    next()
                    return res.json({status:210})
                } 
                if(isMatch){
                    await User.updateOne({email: req.session.passport.user.email},
                    {
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                    })
                    
                    res.locals.level = 'info'
                    res.locals.message = `Bruker endret på brukerinformasjon ${req.body.firstname} - ${req.body.lastname}`
                    
                    req.session.passport.user.firstname = req.body.firstname
                    req.session.passport.user.lastname = req.body.lastname
                    res.json({status:200})
                    next()
                } else{
                    res.json({status:210})
                }   
            })
          })
        
    })
    // slett bruker (ferdig, men må testes)
    .delete(isUser, async (res, req, next) => {
        await User.findOne({ email: req.session.passport.user.email }).select("+password").then((user) => {  
            if (!user) {
                res.locals.level = 'error'
                res.locals.message = `fant ikke brukeren ${user}`
                next()
                return res.json({status:210})
                }
            bcrypt.compare(req.body.password, user.password, async function(err, isMatch) {
                if(err){
                    res.locals.level = 'error'
                    res.locals.message = `skjedde en feil under sletting av bruker ${err}`
                    next()
                    return res.json({status:210})
                } 
                if(isMatch){
                    res.locals.level = 'info'
                    res.locals.email = req.session.passport.user.email
                    res.locals.message = `Bruker slettet brukeren sin ${req.session.passport.user.email}`
                    User.deleteOne({email: req.session.passport.user.email})
                    
                    req.logout()
                    req.session.destroy()
                    res.json({status:200})
                    next()
                } else{
                    res.json({status:210})
                }   
            })
          })
        
    })
    // logge ut.
    router.route('/logout')
    .get(isUser, (req,res,next)=>{
        req.logout();
        req.session.destroy()
        res.clearCookie('connect.sid', {path: '/'}).status(200).send('Ok.');
        next()
    })
    router.route('/newpassword')
        .put(isUser, async (req, res, next)=>{
            await User.findOne({ email: req.session.passport.user.email }).select("+password").then((user) => {  
                if (!user) {
                    res.locals.level = 'error'
                    res.locals.message = `fant ikke brukeren ${user}`
                    next()
                    return res.json({status:210})
                    }
                bcrypt.compare(req.body.password, user.password, async function(err, isMatch) {
                    if(err){
                        res.locals.level = 'error'
                        res.locals.message = `skjedde en feil under sammenligning av passord ${err}`
                        next()
                        return res.json({status:210})
                    } 
                    
                    if(isMatch){
                        const saltRounds = 10
                        bcrypt.hash(req.body.newPassword, saltRounds, async (err, hash) =>{
                            await User.updateOne({email: req.user.email},
                                {
                                    password: hash
                                })
                        })
                        console.log
                        
                        res.locals.level = 'info'
                        res.locals.message = `Bruker endret på passord ${user}`
                        res.json({status:200})
                        next()
                    } else{
                        res.json({status:210})
                    }   
                })
              })
        })
    router.route('/all')
            .get(isAdmin, async (req, res, next)=>{
                const users = await User.find();
                res.json(users).status(200)
            })

module.exports = router;
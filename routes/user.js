const express = require('express'),
      router = express.Router(),
      User = require('../config/userSchema'),
      passport = require('passport'),
      bcrypt = require('bcrypt'),
      { isAdmin, isUser, isRoot, isEditor } = require('../routes/AuthMiddelware')

// regex for å validere e-post adresse
// hentet fra https://emailregex.com/
const mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<;>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const isEmail = (email)=> {return email.match(mailRegex)}
//registrerer bruker
router.route('/signup')
    .post(async (req, res, next) => {
        if(isEmail(req.body.email.toLowerCase())){
            //lagrer data i userSchema objekt
            const nyBruker = new User({
                email: req.body.email.toLowerCase(),
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                password: req.body.password,
            })
            //lagrer i db
            await nyBruker.save((err, doc)=>{
                if(err)return res.json("E-post allerede i bruk")
               
                //logger krever at route sender med info
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
    // endre på bruker sitt fornavn og etternavn
    .put(isUser, async (req, res, next) => {
        // endringer på bruker krever passord for å 
        // bekrefte endringer så vi henter bruker 
        // med passord
        User.findOne({ email: req.session.passport.user.email}).select("+password").then((user) => {  
            if (!user) {
                res.locals.level = 'error'
                res.locals.message = `fant ikke brukeren ${user}`
                res.json({status:210})
                next()
                return done(null, false); 
            }
            // sammenligner det innsendte passordet med hash passordet på user
            // objektet fra databasen
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
    // slett bruker
    .delete(isUser, async (req, res, next) => {
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
                    console.log(req.session.passport.user.email)
                    User.deleteOne({email: req.session.passport.user.email}, (err)=>{
                        res.locals.level = 'info'
                        res.locals.email = req.session.passport.user.email
                        res.locals.message = `Bruker slettet brukeren sin ${req.session.passport.user.email}`
                        req.logout()
                        req.session.destroy()
                        res.json({status:200})
                        next()
                    })
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
        req.session.destroy();
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
            .put(isUser, async (req, res, next) => {
                // endringer på bruker krever passord for å 
                // bekrefte endringer så vi henter bruker 
                // med passord
                User.findOne({ email: req.session.passport.user.email}).then(async (user) => {  
                    if (!user) {
                        res.locals.level = 'error'
                        res.locals.message = `fant ikke brukeren ${user}`
                        res.json({status:210})
                        next()
                        return done(null, false); 
                    } else{
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
                    }        
                  })   
            })

module.exports = router;
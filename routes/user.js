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
            await nyBruker.save((err)=>{
                res.locals.level = 'error'
                res.locals.email = req.body.email
                if(err){
                    res.locals.message = 'E-post er allerede i bruk'
                    return res.json("E-post allerede i bruk")
                } else{
                    res.locals.level = 'info'
                    res.locals.message = 'Bruker ble registrert'
                    res.json("Bruker registrert")
                }
            })
        } else{
            res.locals.message = 'Ugyldig email ble brukt i registrering'
            res.json("Ugyldig Email")
        }
    })

router.route('/getsignup')
    .get(async (req, res, next) => {
        const nyBruker = new User({
            email: "aa@bb.cc",
            firstname: "Krister \"Bjelke\"",
            lastname: "Iversen",
            password: "Pass*123",
        })
        await nyBruker.save((err)=>{
            if(err) return err;
            console.log("Bruker ble registrert")
        })
        res.send("Bruker registrert")
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
    // laget login som bruker localstrategy fra passport
    //login (ferdig)
    .post(passport.authenticate('local'), (req, res, next) => {
        res.locals.level = 'info'
        res.locals.email = req.session.passport.user.email
        res.locals.message = 'Bruker logget inn'
        res.json({
            loginStatus:true,
            user:req.session.passport.user
        })
        next()
    })
    // endre på bruker (ferdig, men må testes)
    .put(isUser, async (req, res, next) => {
        User.findOne({ email: email.toLowerCase() }).select("+password").then((user) => {  
            if (!user) {
                logger.log({
                    level: 'info',
                    email: req.session.passport.user.email,
                    message: 'Bruker logget inn'
                })
                 return done(null, false); 
                }
            bcrypt.compare(req.body.password, user.password, async function(err, isMatch) {
                if(err){
                    logger.log({
                        level: 'error',
                        email: req.session.passport.user.email,
                        message: 'noe gikk galt under sammeligning av passord'
                    })
                    return res.json("noe gikk galt")
                }else if(isMatch){
                    await User.updateOne({email: req.user.email},
                    {email: req.body.email, 
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    password: req.body.newPassword})

                    logger.log({
                        level: 'info',
                        email: req.session.passport.user.email,
                        message: 'Bruker endret på brukerinformasjon'
                    })

                    req.session.passport.user.email = req.body.email
                    req.session.passport.user.name = req.body.name
                } else{
                    logger.log({
                        level: 'info',
                        email: req.session.passport.user.email,
                        message: 'Bruker brukte feil passord for endring av brukerinformasjon'
                    })
                }
                
            })
          });
        next()
    })
    // slett bruker (ferdig, men må testes)
    .delete(isUser, async (res, req, next) => {
        await User.deleteOne({email: req.session.user.email})

        res.locals.level = 'info'
        res.locals.email = req.session.passport.user.email
        res.locals.message = 'Bruker slettet brukeren sin'

        req.logout()
        req.session.destroy()
        next()
    })
    //laget logg ut funksjon til bruker
    // logge ut. (ferdig)
    router.route('/logout')
    .get(isUser, (req,res,next)=>{
        res.locals.level = 'info'
        res.locals.email = req.session.passport.user.email
        res.locals.message = 'Bruker logget ut'
        req.logout();
        req.session.destroy()
        res.clearCookie('connect.sid', {path: '/'}).status(200).send('Ok.');
        next()
    })

module.exports = router;
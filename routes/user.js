const express = require('express'),
      router = express.Router(),
      User = require('../config/userSchema'),
      passport = require('passport'),
      bcrypt = require('bcrypt')

const mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<;>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const isEmail = (email)=> {
    return email.match(mailRegex)
}

// laget api som registrerer bruker med encryptet hash passord
router.route('/signup')
    .post(async (req, res, next) => {
        if(isEmail(req.body.email.toLowerCase())){
            if(true){
                //registrer bruker
                const nyBruker = new User({
                    email: req.body.email.toLowerCase(),
                    name: req.body.name,
                    password: req.body.password,
                })
                await nyBruker.save((err)=>{
                    if(err) return err;
                    console.log("Bruker ble registrert")
                })
                res.send("Bruker registrert")
            }else{
                res.send("E-post allerede i bruk")
            }
        } else{
            res.send("Ugyldig Emailsdfg")        
        }
    })

// laget login som bruker localstrategy fra passport
router.route('/')
    //login (ferdig)
    .post(passport.authenticate('local'), (req, res, next) => {next()})
    // endre på bruker (ferdig, men må testes)
    .put(async (req, res, next) => {
        User.findOne({ email: email.toLowerCase() }).select("+password").then((user) => {  
            if (!user) { return done(null, false); }
            bcrypt.compare(req.body.password, user.password, async function(erro, isMatch) {
                await User.updateOne({email: req.user.email},
                    {email: req.body.email,
                    name: req.body.name,
                    password: req.body.newPassword})

                    req.session.passport.user.email = req.body.email
                    req.session.passport.user.name = req.body.name
            })
          });
        next()
    })
    // slett bruker (ferdig, men må testes)
    .delete(async (res, req, next) => {
        await User.deleteOne({email: req.session.user.email})
        req.logout()
        req.session.destroy()
        next()
    })
    //laget logg ut funksjon til bruker
    // logge ut. (ferdig)
    router.route('/logout')
    .get( (req,res,next)=>{
        req.logout();
        req.session.destroy()
        res.clearCookie('connect.sid', {path: '/'}).status(200).send('Ok.');
        next()
    })

module.exports = router;
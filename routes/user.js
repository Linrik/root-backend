const passport = require('passport');

const express = require('express'),
      router = express.Router(),
      User = require('../config/userSchema')


const conn = process.env.DB_STRING;


router.route('/signup')
    .post(async (req, res, next) => {
        //registrer bruker
        const nyBruker = new User({
            username: req.body.username,
            password: req.body.password,
        })
        await nyBruker.save((err)=>{
            if(err) return err;
            console.log("Bruker ble registrert")
        })
        next()
    })

  

router.route('/')
        //login
    .post(passport.authenticate('local'), (req, res, next) => {next()})
    /*.get(async (req, res) => {
        //hente bruker
        if(req.isAuthenticated){
            const user = await User.findOne({brukernavn: req.body.username}).select("-password");
            res.json(user)
        } else{
            res.send("du er ikke logget inn")
        }
    })*/
    .put(async (req, res) => {
        const id = req.session.cookie
        const user = await User.findOne
    })
    .delete((res, req) => {
        //slette bruker
    })
    router.route('/logout')
    .post((req,res,next)=>{
        req.logOut()
        next()
    })

module.exports = router;




/*
router
    .route('/')
    .post((req, res) => {
        
    })
    .get((req, res) => {

    })
    .put((req, res) => {

    })
    .delete((res, req) => {

    })
module.exports = router;

logge inn
async (req, res) => {
        //logge inn bruker
        await Bruker.findOne({email: req.body.username}, (err, bruker)=>{
            if(err){
                res.send("Noe gikk galt")
            } else {
                bcrypt.compare(req.body.passord, bruker.passord, (err, res) => {
                    if(err){
                        res.send("Noe gikk galt")
                    } else if(res){
             
                    } else{
                        res.send("Noe gikk galt")
                    }
                })
            }
       })
    }
*/
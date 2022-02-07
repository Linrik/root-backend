const express = require('express'),
      router = express.Router(),
      User = require('../config/userSchema'),
      mongoose = require('mongoose')

/*
router.use((req, res, next) =>{
    console.log("hey");
})*/

router.route('/signup')
    .post(async (req, res) => {
        //registrer bruker
        const nyBruker = new Bruker({
            username: req.body.username,
            passord: req.body.passord,
        })
        await nyBruker.save((err)=>{
            if(err) return handleError(err);
            console.log("Bruker ble registrert")
        })
    })


router.route('/')
    .post(async (req, res) => {
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
    })
    .get(async (req, res) => {
        //hente bruker
        if(req.isAuthenticated){
            const user = await User.findOne({brukernavn: req.body.username}).select("-password");
            res.json(user)
        } else{
            res.send("du er ikke logget inn")
        }
    })
    .put(async (req, res) => {
        const id = req.session.cookie
        const user = await User.findOne
    })
    .delete((res, req) => {
        //slette bruker
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
*/
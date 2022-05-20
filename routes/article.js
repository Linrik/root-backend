const express = require('express'),
      router = express.Router(),
      User = require('../config/userSchema'),
      passport = require('passport')
    
// laget api som registrerer bruker med encryptet hash passord
router.route('/')
    .post(async (req, res, next) => {
        console.log(req.body.user)
        const text = req.body.text;
        const nyEvent = new Event({
            posterid: req.session.passport.user.id,//må deserialisere brukeren for å hente relevant info
            postername: req.session.passport.user.name,
            tittel: req.body.tittel,
            text: req.body.text,
            dateFrom: req.body.dateFrom,
            dateHourFrom: req.body.hourFrom,
            dateTo: req.body.dateTo,
            dateHourTo: req.body.hourTo,
            bilde: req.body.bilde
        })
        await nyEvent.save((err) =>{
            if(err) return err;
            console.log("Event ble registrert")
        })
        next()
    })
    .get(async (req, res, next) =>{
        
    })
    .update(async (req, res, next) =>{

    })
    .delete(async (req, res, next)=>{

    })
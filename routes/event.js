const express = require('express'),
      router = express.Router(),
      Event = require('../config/eventSchema'),
      comment = require('./comment')

router.route('/')
    .post(async (req, res, next)=>{
        console.log(req.body.user)
        const beskrivelse = [];
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
    .put(async (req, res, next)=>{
        
    })
    .delete(async (rew, res, next)=>{

    })

//Router.route('/comment', comment)
module.exports = router
//sjekk løsninger på poster
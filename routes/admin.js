const express = require('express'),
      router = express.Router(),
      User = require('../config/userSchema'),
      Langstatic = require('../config/langStatSchema'),
      passport = require('passport'),
      session = require('express-session'),
      mongoose = require('mongoose'),
      isAdmin = require('./AuthMiddelware').isAdmin
// laget api til å gi å fjerne rolle med en admin sjekk
// gi root rolle
router.route('/rootMedlem')
    // gi rootmedlem
    .put(async (req, res, next)=>{
        await User.updateOne({email: req.body.email}, {rootMember: true})
        await 
        console.log()
        next()
    })
// fjern rolle
    .delete(async (req, res, next)=>{
        await User.updateOne({email: req.body.email}, {$set: {rootMember: false}})
        next()
    })
// gi admin rolle
router.route('/admin')
    .put(async (req, res, next)=>{
        await User.updateOne({email: req.body.email}, {admin: true})
        next()
    })
    // fjern rolle
    .delete(async (req, res, next)=>{
        await User.updateOne({email: req.body.email}, {$set: {admin: false}})
        next()
    })

router.route('/editor')
    .put(async (req, res, next)=>{
        await User.updateOne({email: req.body.email}, {editor: true})
        next()
    })
    // fjern rolle
    .delete(async (req, res, next)=>{
        await User.updateOne({email: req.body.email}, {$set: {editor: false}})
        next()
    })

router.route('/languague')
    .post(async (req, res, next)=>{
        const getEng = await Langstatic.findOne({'languague': 'eng'})
        
        const splitTrans = [
            'NO', 
            "Nyheter",
            "Hendelser",
            "Om oss",
            "Profil",
            "Logg ut",
            "Logg in",
            "Registrer deg",
            "Rediger Nyheter",
            "Registrer",
            "Mørk modus",
            "Logger",
            "About",
            "Root",
            "Følg oss!",
            "Test",
            "Arrangementer",
            "Navn",
            "Brukernavn",
            "Passord",
            "Glemt Passord",
            "E-Post",
            "Gjenta Passord",
            "Linjeforeningen for IT",
            "Roller",
            "Admin",
            "Redaktør",
            "Styre medlem",
            "Tittel",
            "Forfatter",
            "Last Opp",
            "Send"
        ]
        const newLang = new Langstatic({
            "languague": splitTrans[0],
            "news_route" : splitTrans[1],
            "events_route" : splitTrans[2],
            "about_us_route" : splitTrans[3],
            "profile" : splitTrans[4],
            "log_out" : splitTrans[5],
            "login": splitTrans[6],
            "register" : splitTrans[7],
            "edit_news" : splitTrans[8],
            "register_user" : splitTrans[9],
            "dark_mode" : splitTrans[10],
            "logger" : splitTrans[11],
            "about" : splitTrans[12],
            "simple_root" : splitTrans[13],
            "simple_follow_us" : splitTrans[14],
            "simple_Test" : splitTrans[15],
            "simple_Event" : splitTrans[16],
            "simple_name" : splitTrans[17],
            "simple_username" : splitTrans[18],
            "simple_password" : splitTrans[19],
            "simple_forgot_password" : splitTrans[20],
            "simple_email" : splitTrans[21],
            "simple_repeat_password" : splitTrans[22],
            "root_student_association" : splitTrans[23],

            "simple_roles" : splitTrans[24],
            "role_administrator" : splitTrans[25],
            "role_editor" : splitTrans[26],
            "role_board_member" : splitTrans[27],

            "simple_title" : splitTrans[28],
            "simple_author": splitTrans[29],
            "simple_upload": splitTrans[30],
            "simple_send": splitTrans[31],
        })
        await newLang.save((err) =>{
            if(err) return err;
            console.log("språk ble lagt til")
        })
        next()
    })

module.exports = router;

// må få endret session til folk når man endrer roller 
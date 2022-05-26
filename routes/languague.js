const express = require('express'),
      router = express.Router(),
      Langstatic = require('../config/langStatSchema'),
      { isAdmin } = require('../routes/AuthMiddelware');

router.route('/')
    .get(async (req, res, next)=>{
        const lang = await Langstatic.findOne({languague: req.body.lang})
        res.json(lang)
        next()
    })
    .post(isAdmin, async (req, res, next)=>{
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
    .put(isAdmin, async (req, res, next)=>{
        await Langstatic.findOne({_id: req.body.lng}, async (err, doc)=>{
            if(err){
                res.locals.level = 'error'
                res.locals.message = `Noe gikk galt ${err}`
                next()
                return err
            }
            doc.overwri
        })
       
        next()
    })
    .delete(isAdmin, async (req, res, next)=>{
        await Langstatic.deleteOne({_id: req.body.langstatic})
        next()
    })

module.exports = router;
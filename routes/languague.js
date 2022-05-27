const express = require('express'),
      router = express.Router(),
      Langstatic = require('../config/langStatSchema'),
      { isAdmin } = require('../routes/AuthMiddelware');

router.route('/')
    .get(async (req, res, next)=>{
        const lang = await Langstatic.find()
        res.json(lang)
        next()
    })
    .post(isAdmin, async (req, res, next)=>{
        const lng = new Langstatic({
            language: req.body.lng,
            languagename: req.body.lngName,
            translate: req.body.translate
        })
        await lng.save((err, doc) =>{
            if(err) {
                res.locals.level = 'error'
                res.locals.message = `noe gikk galt under lagring av språk ${err}`
                res.json({status:210})
                next()
                return err;
            }
            res.locals.level = 'info'
            res.locals.message = `Språk ble lagt til ${doc}`
            res.json({status:200})
            next()
        })
        
    })
    router.route('/:lng')
    .get(async (req, res, next)=>{
        const lang = await Langstatic.find({language: req.params.lng})
        res.json(lang)
        next()
    })
    .put(isAdmin, (req, res, next)=>{
        Langstatic.updateOne({language: req.params.lng},
            {
                translate: req.body.translate
            }, (err, doc)=>{
                if(err){
                    res.locals.level = 'error'
                    res.locals.message = `Noe gikk galt ${err}`
                    next()
                    return err;
                } 
                res.locals.level = 'info'
                res.locals.message = `Språket har blitt endret ${doc}`
                res.json({status:200})
                next()
            })
    })
    .delete(isAdmin, (req, res, next)=>{
        Langstatic.deleteOne({language: req.params.lng}, (err)=>{
            if(err) {
                res.locals.level = 'error'
                res.locals.message = `noe gikk galt under sletting av språk ${err}`
                res.json({status:210})
                next()
                return err;
            }
            res.locals.level = 'info'
            res.locals.message = `Språket har blitt slettet ${req.params.lng}`
            res.json({status:200})
            next()
        })
    })

module.exports = router;
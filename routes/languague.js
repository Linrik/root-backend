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
        const object = {
            norge: 'Norway',
            sverige: 'Sweden'
        }
        const lng = new Langstatic({
            languague: req.body.lng,
            translate: object
        })
        await lng.save((err) =>{
            if(err) res.json(err)
            console.log("språk ble lagt til")
        })
        res.json('asdfg')
        next()
    })
    router.route('/:lng')
    .get(async (req, res, next)=>{
        const lang = await Langstatic.find()
        res.json(lang)
        next()
    })

module.exports = router;
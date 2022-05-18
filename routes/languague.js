const express = require('express'),
      router = express.Router(),
      Langstatic = require('../config/langStatSchema')
      

router.route('/')
    .get(async (req, res, next)=>{
        const lang = await Langstatic.findOne({languague: 'NO'/*req.body.lang*/})
        console.log(lang);
        res.json(lang)
        next()
    })

module.exports = router;
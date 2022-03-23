const express = require('express'),
      router = express.Router(),
      Event = require('../config/eventSchema'),
      comment = require('./comment')

router.route('/')
    .post(async (req, res, next)=>{

    })
    .put(async (req, res, next)=>{

    })
    .delete(async (rew, res, next)=>{

    })

Router.route('/comment', comment)
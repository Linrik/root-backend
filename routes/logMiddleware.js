const logger = require('../config/logger')

module.exports.appLog = (req, res, next)=>{
    if(res.locals.level != undefined && res.locals.email === undefined && res.locals.message != undefined){
        logger.log({
            level: res.locals.level,
            email: req.session.passport.user.email,
            message: res.locals.message
        })
    } if(res.locals.level != undefined && res.locals.email != undefined && res.locals.message != undefined){
        logger.log({
            level: res.locals.level,
            email: res.locals.email,
            message: res.locals.message
        })
    }
    next()
}
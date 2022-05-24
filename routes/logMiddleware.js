const logger = require('../config/logger')

module.exports.appLog = (req, res, next)=>{
    logger.log({
        level: res.locals.level,
        email: res.locals.email,
        message: res.locals.message
    })
    next()
}
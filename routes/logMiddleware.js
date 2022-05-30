const logger = require('../config/logger')
const LoggerDb = require('../config/loggerSchema')

module.exports.appLog = async (req, res, next)=>{
    if(res.locals.level != undefined && res.locals.email === undefined && res.locals.message != undefined){
        const object = {
            logged: Date.get,
            email: req.session.passport.user.email,
            message: res.locals.message
        }
        const logDB = new LoggerDb({log: object})
        await logDB.save();
        logger.log({
            level: res.locals.level,
            email: req.session.passport.user.email,
            message: res.locals.message
        })
    } if(res.locals.level != undefined && res.locals.email != undefined && res.locals.message != undefined){
        const object = {
            logged: Date.now(),
            email: res.locals.email,
            message: res.locals.message
        }
        const logDB = new LoggerDb({log: object})
        await logDB.save();
        logger.log({
            level: res.locals.level,
            email: res.locals.email,
            message: res.locals.message
        })
    }
    next()
}
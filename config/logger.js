const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
//dato;klokkeslett;brukernavn;beskrivelse av hendelse

const appFormat = printf(({timestamp, email, message})=>{
    return `${timestamp};${email};${message}`
})

const logger = createLogger({
        level: 'info',
        format: combine(
            timestamp(),
            appFormat
        ),
        silent: false,
        transports: [
            new transports.File({filename: 'collection.log'})
        ]
    })

module.exports = logger;
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
//dato;klokkeslett;brukernavn;beskrivelse av hendelse

const appFormat = printf(({date, time, email, message})=>{
    return `${timestamp().replace('T', ';').replace('Z', '')};${email};${message}`
})

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        appFormat
    ),
    silent: false,
    transports: [
        new winston.transports.Console({level: 'error'}),
        new winston.transports.File({filename: 'collection.log'})
    ]
})
logger.log({
    level: 'info',
    message: 'dette er en test'
})
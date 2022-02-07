require('dotenv').config()
const session = require('express-session'),
    mongoStore = require('connect-mongo')

const conn = process.env.DB_STRING;
const key = process.env.SECRET;

const runSession = session({
    secret: key,
    resave: false,
    saveUninitialized: false, // lagrer ikke session med mindre du gjør endringer
    store: mongoStore.create({
        mongoUrl: conn,
        collectionName: 'session',
        autoRemove: 'native'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60* 24
    }
})

module.exports = {runSession}


/*
//mongoUrl: 'mongodb://user12345:foobar@localhost/test-app?authSource=admin&w=1'
const dbStore = mongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/tutorialdb',
    collectionName: 'session',
    autoRemove: 'native',
    crypto: {
        secret: 'squirrel'
    }
    //ttl: 14 * 24 * 60 * 60 // = 14 days. Default connect-mongo sin expire cookie funksjon
        //touchAfter: 24 * 3600 // time period in seconds by doing this, setting touchAfter: 
        //24 * 3600 you are saying to the session be updated only one time in a period of 24 hours, does
        // not matter how many request's are made (with the exception of those that change something on the session data)
})*/
/*
app.get('/', (req, res) => {
    if(req.session.viewCount){
        req.session.viewCount = req.session.viewCount + 1
    } else {
        req.session.viewCount = 1
    }
    res.send(`hello world!!!${req.session.viewCount}`)
})
*/
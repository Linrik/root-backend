require('dotenv').config()
const session = require('express-session'),
    mongoStore = require('connect-mongo')

const conn = process.env.DB_STRING;
const key = process.env.SECRET;
// laget session
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
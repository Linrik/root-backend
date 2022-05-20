require('dotenv').config();
require('./config/passport')
const express = require('express'),
      mongoose = require('mongoose'),
      bcrypt = require('bcrypt'),
      passport = require('passport'),
      user = require('./routes/user'),
      app = express(),
      session = require('express-session'),
      mongoStore = require('connect-mongo'),
      cors = require('cors')

const admin = require('./routes/admin'),
      event = require('./routes/event'),
      lang = require('./routes/languague'),
      port = process.env.PORT,
      { isAdmin, isUser, isRoot } = require('./routes/AuthMiddelware');

const dbOptions = {
    useNewUrslParser: true,
    useUnifiedToppology: true
}

const conn = process.env.DB_ONLINE;
const key = process.env.SECRET;

const db = mongoose.connect(conn, ()=> {
    console.log("connected to MongoDB")
}, e => console.error(e));

const corsOptions = {
    origin: true,
    credentials: true
  }

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(session({
        secret: key,
        resave: false,
        saveUninitialized: true, // lagrer ikke session med mindre du gjør endringer
        store: mongoStore.create({
            mongoUrl: conn,
            collectionName: 'session',
            autoRemove: 'native'
        }),
        name: 'user',
        cookie: {
            maxAge: 1000 * 60 * 60* 24
        }
    }))
app.use(passport.initialize())
app.use(passport.session())
app.use(passport.authenticate('session'))
app.use('/user', user) //filen håndterer alt som kommer inn i routen til login
app.use('/event', isRoot, event)
app.use('/languague', lang)
app.use('/admin', isAdmin, admin)
app.use((req, res, next)=>{
    console.log(req.session.passport)
    next()
})
app.get('/', (req, res) =>{
    res.send("123")
})

app.listen(port, () => {
    console.log(`Listening to ${port}`)
})
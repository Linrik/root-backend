require('dotenv').config();
require('./config/passport')
const express = require('express'),
      mongoose = require('mongoose'),
      passport = require('passport'),
      app = express(),
      session = require('express-session'),
      mongoStore = require('connect-mongo'),
      cors = require('cors')

const admin = require('./routes/admin'),
      event = require('./routes/event'),
      lang = require('./routes/languague'),
      article = require('./routes/article'),
      user = require('./routes/user'),
      comment = require('./routes/comment'),
      logger = require('./config/logger'),
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

var allowedOrigins = ['http://localhost:3000',
                      'https://localhost:3000'
];

const corsOptions = {
    // origin: true,
    origin: function(origin, callback){
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
          var msg = 'The CORS policy for this site does not ' +
                    'allow access from the specified Origin.';
          return callback(new Error(msg), false);
        }    return callback(null, true);
      },
    optionSuccesStatus: 200,
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
app.use('/event', event)
app.use('/article', article)
app.use('/comment', comment)
app.use('/languague', lang)
app.use('/admin', isAdmin, admin)
app.use((req, res, next)=>{
    console.log(req.user)
    next()
})
/*
app.use((req, res, next)=>{
    logger.log({
        level: 'info',
        email: req.session.passport.user.email,
        message: 'dette er en test'
    })
    next()
})*/

app.get('/', (req, res) =>{
    res.send("123")
})


app.listen(port, () => {
    console.log(`Listening to ${port}`)
})
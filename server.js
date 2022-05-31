require('dotenv').config();
require('./config/passport')
const express = require('express'),
      app = express(),
      mongoose = require('mongoose'),
      passport = require('passport'),
      session = require('express-session'),
      mongoStore = require('connect-mongo'),
      cors = require('cors')

const admin = require('./routes/admin'),
      event = require('./routes/event'),
      lang = require('./routes/languague'),
      article = require('./routes/article'),
      user = require('./routes/user'),
      comment = require('./routes/comment'),
      { appLog } = require('./routes/logMiddleware'),
      port = process.env.PORT,
      { isAdmin } = require('./routes/AuthMiddelware');
const path = require('path')

const dbOptions = {
    useNewUrslParser: true,
    useUnifiedToppology: true
}

const conn = process.env.DB_ONLINE;
const key = process.env.SECRET;

const db = mongoose.connect(conn, ()=> {
    console.log("connected to MongoDB")
}, e => console.error(e));

// var allowedOrigins = ['http://localhost:3000',
//                       'https://localhost:3000'
// ];
const sessionOptions = {
    secret: key,
        resave: false,
        saveUninitialized: true,
        store: mongoStore.create({
            mongoUrl: conn,
            collectionName: 'session',
            autoRemove: 'native'
        }),
        name: 'user',
        cookie: {
            secure: process.env.SECURECOOKIE === 'true' ? true : false,
            maxAge: 1000 * 60 * 60* 24
        }
}
const corsOptions = {
    // origin: true,
    origin: function(origin, callback){
        if(!origin) return callback(null, true);
        // if(allowedOrigins.indexOf(origin) === -1){
        //   var msg = 'The CORS policy for this site does not ' +
        //             'allow access from the specified Origin.';
        //   return callback(new Error(msg), false);
        // }
        return callback(null, true);
      },
    optionSuccesStatus: 200,
    credentials: true
  }
app.set('trust proxy', 1);
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(session(sessionOptions))
app.use(passport.initialize())
app.use(passport.session())
app.use(passport.authenticate('session'))
app.use('/api/resources', express.static('resources'))
app.use('/api/user', user, appLog)
app.use('/api/event', event, appLog)
app.use('/api/article', article, appLog)
app.use('/api/comment', comment, appLog)
app.use('/api/language', lang, appLog)
app.use('/api/admin', isAdmin, admin, appLog)
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res)=>{
    res.sendFile(__dirname +"/client/build/index.html", function(err) {
        if (err) {
            // return res.status(err.status).end();
            return res.status(404).end();
        } else {
            return res.status(200).end();
        }
    });
})

app.listen(port, () => {
    console.log(`Listening to ${port}`)
})
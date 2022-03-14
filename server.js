require('dotenv').config();
require('./config/passport')
const express = require('express'),
      mongoose = require('mongoose'),
      bcrypt = require('bcrypt'),
      passport = require('passport'),
      cors = require('cors')

const session = require('./session/session'),
      user = require('./routes/user'),
      admin = require('./routes/admin'),
      app = express(),
      port = 3080,
      { isAdmin, isRoot, isUser } = require('./routes/AuthMiddelware');

const dbOptions = {
    useNewUrslParser: true,
    useUnifiedToppology: true
}

const conn = process.env.DB_STRING;

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

app.use(session.runSession)
app.use(passport.initialize())
app.use(passport.session())
app.use(passport.authenticate('session'))
app.use('/user', user) //filen håndterer alt som kommer inn i routen til login
//app.use('/admin', isAdmin, admin)
app.use((req, res, next)=>{
    console.log(req.user)
    next()
})




app.get('/', (req, res) => {
    res.json(req.user);
});

app.listen(port, () => {
    console.log(`Listening to ${port}`)
})

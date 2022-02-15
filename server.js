const { isAdmin } = require('./routes/AuthMiddelware');

require('dotenv').config();
require('./config/passport')
const express = require('express'),
      mongoose = require('mongoose'),
      bcrypt = require('bcrypt'),
      session = require('./session/session'),
      passport = require('passport'),
      user = require('./routes/user'),
      admin = require('./routes/admin'),
      app = express(),
      port = 3000,
      isUser = require("./routes/AuthMiddelware").isUser
      isRoot = require("./routes/AuthMiddelware").isRoot

const dbOptions = {
    useNewUrslParser: true,
    useUnifiedToppology: true
}

const conn = process.env.DB_STRING;

const db = mongoose.connect(conn, ()=> {
    console.log("connected to MongoDB")
}, e => console.error(e));

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(session.runSession)
app.use(passport.initialize())
app.use(passport.session())
app.use('/user', user) //filen håndterer alt som kommer inn i routen til login
app.use('/admin', isAdmin, admin)
//app.use(passport.authenticate('session'))

app.use((req, res, next)=>{
    console.log(req.user)
    next()
})

app.get('/bruker', isUser, (req, res) => {
        res.send("nice")
})

app.get('/root', isRoot, (req, res) => {
    res.send("nice medlem")
})

app.get('/', (req, res) => {
    res.send('hello world');
});

app.listen(port, () => {
    console.log(`Listening to ${port}`)
})

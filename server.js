require('dotenv').config();
const express = require('express'),
      mongoose = require('mongoose'),
      bcrypt = require('bcrypt'),
      session = require('./session/session'),
      passport = require('passport'),
      user = require('./routes/user'),
      app = express(),
      port = 3000


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
app.use(passport.authenticate('session'))
app.use('/user', user) //filen håndterer alt som kommer inn i routen til login



app.get('/', (req, res) => {
    res.send('hello world');
});

app.listen(port, () => {
    console.log(`Listening to ${port}`)
})
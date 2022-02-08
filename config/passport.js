const User = require('./userSchema'),
      LocalStrategy = require('passport-local').Strategy,
      express = require('express'),
      passport = require('passport'),
      bcrypt = require('bcrypt')

const strategy = new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }).select("+password").then((user) => {   
        if (!user) { return done(null, false); }
        bcrypt.compare(password, user.password, function(erro, isMatch) {
          if (erro) return done(erro);
          if(!isMatch) return done(null, false)
          console.log(isMatch)
        })
        return done(null, user);
      });
    }
);

  passport.use(strategy)

  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username });
    });
  });

  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });



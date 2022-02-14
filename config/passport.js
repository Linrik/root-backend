const User = require('./userSchema'),
      LocalStrategy = require('passport-local').Strategy,
      express = require('express'),
      passport = require('passport'),
      bcrypt = require('bcrypt')

  passport.use(new LocalStrategy({
      usernameField: 'email',
      passReqToCallback: true
    },
    function(req, email, password, done) {
      User.findOne({ email: email }).select("+password").then((user) => {  
        if (!user) { return done(null, false); }
        bcrypt.compare(password, user.password, function(erro, isMatch) {
          if (erro) return done(erro);
          if(!isMatch) return done(null, false)
        })
        return done(null, user);
      });
    })
  )

  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, email: user.email });
    });
  });

  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });



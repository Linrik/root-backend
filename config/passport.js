const User = require('./userSchema'),
      LocalStrategy = require('passport-local').Strategy,
      express = require('express'),
      passport = require('passport'),
      bcrypt = require('bcrypt')
      
// implementert passport sin local strategy
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passReqToCallback: true
    },
    function(req, email, password, done) {
      User.findOne({ email: email.toLowerCase() }).select("+password").then((user) => {  
        if (!user) { return done(null, false); }
        bcrypt.compare(password, user.password, function(erro, isMatch) {
          if (erro) return done(erro);
          if(!isMatch) return done(null, false)
        })
        return done(null, user);
      });
    })
  )
// laget sjekker som sjekker hvilken rolle du har og tar det med i passport fieldet i session
  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      // en helt elendig sjekk på roller som sjekker hva som skal bli sendt til passport fielden i session
      if(user.rootMember){
        if(user.admin){
          cb(null, { id: user.id, name: user.name, rootMember: user.rootMember, admin: user.admin});
        } else {
          cb(null, { id: user.id, name: user.name, rootMember: user.rootMember});
        }
      } else if(user.admin){
        cb(null, { id: user.id, name: user.name, admin: user.admin});
      } else{
        cb(null, { id: user.id, name: user.name });
      }
    });
  });

  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });



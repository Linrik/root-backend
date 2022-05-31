const User = require('./userSchema'),
      LocalStrategy = require('passport-local').Strategy,
      passport = require('passport'),
      bcrypt = require('bcrypt')
      
// implementert passport sin local strategy
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passReqToCallback: true
    },
    async function(req, email, password, done) {
      await User.findOne({ email: email.toLowerCase() }).select("+password").then((user) => {  
        if (!user) { return done(null, false); }
        bcrypt.compare(password, user.password, function(erro, isMatch) {
          if (erro) return done(erro);
          if(!isMatch) return done(null, false)
          return done(null, user);
        })
      });
    })
  )
  //serialiserer bruker og setter id på cookien
  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, {id:user.id, firstname:user.firstname, lastname: user.lastname, email:user.email, 
        rootMember: user.rootMember, admin: user.admin, editor: user.editor})
    });
  });
  //deserialiserer bruker og sjekker id opp mot databasen og henter bruker
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });



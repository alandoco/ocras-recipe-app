const passport = require('passport');
const User = require('../models/user')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

//Serialize determines the data passed into the session - user in this case
//It's stored in req.session.passport.user
passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/verify",
  },
  async function(request, accessToken, refreshToken, profile, done) {

    try {
      const user = await User.findOne({email: profile.emails[0].value})

      if(user) {
        return done(null, user);
      }
      
      const newUser = new User({firstName: profile.name.givenName, lastName: profile.name.familyName, email:profile.emails[0].value, isVerified:true})
      await newUser.generateAuthToken()

      await newUser.save()
      done(null, newUser)

    } catch (e) {
      return done(e)
    }
  }
));

module.exports = {passport}
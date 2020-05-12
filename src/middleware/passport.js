const passport = require('passport');
const User = require('../models/user')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {convertImage} = require('../utils/file-upload')
const {downloadImageFromURL} = require('../utils/helpers')

//Sets the cookie using the 2nd param passed into the done method
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser( async (id, done) => {
  try {
    const user = await User.findById(id)

    if(!user){
      return done(null, false, {error: "User not found"})
    }

    done(false, user)

  } catch(e) {
    done(e)
  }
 })

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/verify",
  },
  async function(request, accessToken, refreshToken, profile, done) {

    try {
      const user = await User.findOne({email: profile.emails[0].value})

      if(user) {
        //Done passes the user into the request object which is used to call serialize()
        return done(null, user);
      }

      //Downloading and converting google avatar
      const image = await downloadImageFromURL(profile.photos[0].value)
      const buffer = await convertImage(image)
      
      const newUser = new User({firstName: profile.name.givenName, lastName: profile.name.familyName, email:profile.emails[0].value, avatar: buffer, isVerified:true})
      await newUser.generateAuthToken()

      await newUser.save()
      done(null, newUser)

    } catch (e) {
      return done(e)
    }
  }
));

module.exports = {passport}
const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const { User } = require("../dao/models/schemas");

passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: "Incorrect Email" });
          }
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            return done(null, false, { message: "Incorrect Password" });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  
  passport.use(
    new GitHubStrategy(
      {
        clientID: "bf5580ef8d8c0f409f76",
        clientSecret: "63b44a93f79c1d96e28023e3bbe8feeb206cbfa8",
        callbackURL: "http://localhost:8080/auth/github/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existingUser = await User.findOne({ githubId: profile.id });
          if (existingUser) {
            return done(null, existingUser);
          } else {
            const newUser = new User({
              first_name: profile.displayName,
              last_name: 'G',
              age: 100,
              email: '100G@gmail.com',
              password: 'githublogin',
              githubId: profile.id,
            });
            await newUser.save();
            return done(null, newUser);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });


  module.exports = passport;
  

const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const { User } = require('./models/models'); // Adjust the path as necessary

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: 'No user with that email' });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return done(null, false, { message: 'Password incorrect' });
      }
      return done(null, user);
    } catch (e) {
      return done(e);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET // The same secret used to sign the JWT
};

    passport.use(new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id); // Assuming your JWT payload contains the user ID
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    }));

// Use the GoogleStrategy within Passport.
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/google/callback"
//   },
//   (accessToken, refreshToken, profile, done) => {
//     // Find or create a user in your database
//     let user = users.find(user => user.id === profile.id);
//     if (!user) {
//       user = { id: profile.id, name: profile.displayName };
//       users.push(user);
//     }
//     done(null, user);
//   }
// ));

// Use the LinkedInStrategy within Passport.
// passport.use(new LinkedInStrategy({
//     clientID: process.env.LINKEDIN_CLIENT_ID,
//     clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/linkedin/callback",
//     scope: ['r_emailaddress', 'r_liteprofile'],
//   },
//   (accessToken, refreshToken, profile, done) => {
//     // Find or create a user in your database
//     let user = users.find(user => user.id === profile.id);
//     if (!user) {
//       user = { id: profile.id, name: profile.displayName };
//       users.push(user);
//     }
//     done(null, user);
//   }
// ));
}

module.exports = initialize;

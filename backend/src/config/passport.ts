// backend/src/config/passport.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import * as userServices from '../services/users/usersServices';
import { generateToken } from '../utils/jwt.utils';
import { INewUserEntry } from '../models/user';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract email and name from Google profile
        const email = profile.emails && profile.emails[0].value;
        const name = profile.displayName;
        if (!email) {
          return done(new Error('No email found in Google profile'), null);
        }
        
        // Check if the user exists
        let user = await userServices.findByEmail(email);
        if (!user) {
          // Generate a new userId and register the user
          const userId = await userServices.getNextUserId();
          const newUserData = {
            name,
            email,
            userId,
            profile: 'user',
            password: '', // Not used in OAuth flows
            enabled: true,
          } as unknown as INewUserEntry; // Force the type to INewUserEntry
          
          user = await userServices.register(newUserData);
        }
        
        // Determine access types (extracting only string keys from the enums)
        let accessTypes: string[] = [];
        if (user.profile === 'admin') {
          accessTypes = Object.keys(require('../models/enums').AdminAccessTypes).filter(
            (key) => isNaN(Number(key))
          );
        } else {
          accessTypes = Object.keys(require('../models/enums').AccessTypes).filter(
            (key) => isNaN(Number(key))
          );
        }
        
        // Generate your JWT token using user data
        const token = generateToken({
          name: user.name,
          email: user.email,
          userId: user.userId,
          accessTypes,
        });
        
        // Return the user and token
        return done(null, { user, token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
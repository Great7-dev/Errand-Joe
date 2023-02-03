import express, { Request, Response, NextFunction }  from "express";
import 'dotenv/config';
import passport from 'passport';
import passportLinkedIn from 'passport-linkedin-oauth2';

const LinkedInStrategy = passportLinkedIn.Strategy


const CLIENT_ID_LI: string|any = process.env.CLIENT_ID_LINKEDIN;
const CLIENT_SECRET_LI: string|any = process.env.CLIENT_SECRET_LINKEDIN;


export default function linkedinConfig(){passport.use(new LinkedInStrategy({
  clientID: CLIENT_ID_LI,
  clientSecret: CLIENT_SECRET_LI,
  callbackURL: "http://localhost:3000/auth/linkedin/callback",
  scope: ['r_emailaddress', 'r_liteprofile'],
}, function(token, tokenSecret, profile, done) {
  // asynchronous verification, for effect...
  process.nextTick(function () {
    // To keep the example simple, the user's LinkedIn profile is returned to
    // represent the logged-in user. In a typical application, you would want
    // to associate the LinkedIn account with a user record in your database,
    // and return that user instead.
    return done(null, profile);
  });
}));
}

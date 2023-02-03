import express, { Request, Response, NextFunction }  from "express";
import 'dotenv/config';
import passport from 'passport';
import passportFacebook from 'passport-facebook';


const FacebookStrategy = passportFacebook.Strategy


passport.serializeUser(function(user, cb){
    cb(null, user)
  })
  
  passport.deserializeUser(function(obj:string, cb){
    cb(null, obj)
  })
  

const CLIENT_ID_FB: string|any = process.env.CLIENT_ID_FB;
const CLIENT_SECRET_FB: string|any = process.env.CLIENT_SECRET_FB;

export default function facebookConfig(){passport.use(new FacebookStrategy({
  clientID: CLIENT_ID_FB,
  clientSecret: CLIENT_SECRET_FB,
  callbackURL: "http://localhost:3000/auth/facebook/callback"
},
function(accessToken:any, refreshToken:any, profile:any, done:any) {
       
      return done(null, profile);
}
));
}



import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import querystring from "querystring";
import * as queryString from 'query-string';
import axios from "axios";
import passport from 'passport';
import passportFacebook from 'passport-facebook';
import session from 'express-session';
import passportTwitter from "passport-twitter";

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import connectDB from './config/database.config';

const FacebookStrategy = passportFacebook.Strategy
const TwitterStrategy = passportTwitter.Strategy



connectDB()

const COOKIE_NAME: string|any = process.env.COOKIE_NAME;
const JWT_SEC:string|any = process.env.JWT_SEC;
const SERVER_ROOT_URI: string|any = process.env.SERVER_ROOT_URI;

const app = express();

app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');


app.use( cors({
  // Sets Access-Control-Allow-Origin to the UI URI
  origin: SERVER_ROOT_URI,
  // Sets Access-Control-Allow-Credentials to true
  credentials: true,
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'mysecret',}))
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb){
  cb(null, user)
})

passport.deserializeUser(function(obj:string, cb){
  cb(null, obj)
})

const client_id: string|any= process.env.CLIENT_ID;



app.use('/users', indexRouter);
app.use('/user', usersRouter);

//Google Login

const redirectURI = "auth/google";

function getGoogleAuthURL() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: `${SERVER_ROOT_URI}/${redirectURI}`,
    client_id: client_id,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  return `${rootUrl}?${querystring.stringify(options)}`;
}

// Getting login URL
app.get("/auth/google/url", (req, res) => {
  return res.send(getGoogleAuthURL());
});

function getTokens({
  code,
  clientId,
  clientSecret,
  redirectUri,
}: {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}): Promise<{
  access_token: string;
  expires_in: Number;
  refresh_token: string;
  scope: string;
  id_token: string;
}> {
  /*
   * Uses the code to get tokens
   * that can be used to fetch the user's profile
   */
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  };

  return axios
    .post(url, querystring.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch auth tokens`);
      throw new Error(error.message);
    });
}

// Getting the user from Google with the code
app.get(`/${redirectURI}`, async (req, res) => {
  const code = req.query.code as string;
  const client_secret: string|any = process.env.CLIENT_SECRET;
  

  const { id_token, access_token } = await getTokens({
    code,
    clientId: client_id,
    clientSecret: client_secret,
    redirectUri: `${SERVER_ROOT_URI}/${redirectURI}`,
  });

  // Fetch the user's profile with the access token and bearer
  const googleUser = await axios
    .get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    )
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch user`);
      throw new Error(error.message);
    });
  const token = jwt.sign(googleUser, JWT_SEC);

  res.cookie(COOKIE_NAME, token, {
    maxAge: 900000,
    httpOnly: true,
    secure: false,
  });

  res.json("success");
});

// Getting the current user
app.get("/auth/me", (req, res) => {
  console.log("get me");
  try {
    const decoded = jwt.verify(req.cookies[COOKIE_NAME], JWT_SEC);
    console.log("decoded", decoded);
    return res.send(decoded);
  } catch (err) {
    console.log(err);
    res.send(null);
  }
});




//Facebook Login

const CLIENT_ID_FB: string|any = process.env.CLIENT_ID_FB;
const CLIENT_SECRET_FB: string|any = process.env.CLIENT_SECRET_FB;

passport.use(new FacebookStrategy({
  clientID: CLIENT_ID_FB,
  clientSecret: CLIENT_SECRET_FB,
  callbackURL: "http://localhost:3000/auth/facebook/callback"
},
function(accessToken:any, refreshToken:any, profile:any, done:any) {
       console.log(profile);
      return done(null, profile);
}
));
app.get('/login-facebook',passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.json('success');
  });
app.get('/failed', (req, res) => {
  res.send('failed');
});
//LOGOUT
app.get('/logout', (req, res) => {
  req.session.destroy(function(err){
    res.clearCookie('connect.sid');
    res.send('logout');
  });
});


app.use(function (req, res, next) {
    next(createError(404));
  });
export default app;



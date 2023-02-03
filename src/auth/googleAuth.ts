import express, { Request, Response, NextFunction }  from "express";
import path from 'path';
import cors from 'cors';
import 'dotenv/config';
import querystring from "querystring";
import axios from "axios";
import passport from 'passport';
import jwt from 'jsonwebtoken';
import cookieParser from "cookie-parser";
import session from "express-session";
import router from "../routes";

const app = express();

const COOKIE_NAME: string|any = process.env.COOKIE_NAME;
const JWT_SEC:string|any = process.env.JWT_SEC;
const SERVER_ROOT_URI: string|any = process.env.SERVER_ROOT_URI;

app.use( cors({
    // Sets Access-Control-Allow-Origin to the UI URI
    origin: SERVER_ROOT_URI,
    // Sets Access-Control-Allow-Credentials to true
    credentials: true,
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'mysecret',resave: true,
saveUninitialized: true}))
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb){
    cb(null, user)
  })
  
  passport.deserializeUser(function(obj:string, cb){
    cb(null, obj)
  })
  

const client_id: string|any= process.env.CLIENT_ID;

const redirectURI = "auth/google";

export function getGoogleAuthURL() {
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

export function getTokens({
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

// Getting the current user
app.get("/auth/me", (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies[COOKIE_NAME], JWT_SEC);
    console.log("decoded", decoded);
    return res.send(decoded);
  } catch (err) {
    console.log(err);
    res.send(null);
  }
});


export default app;
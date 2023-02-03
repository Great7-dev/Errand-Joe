import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import 'dotenv/config';
import passport from 'passport';
import session from 'express-session';
import facebookConfig from './auth/facebookAuth';
import linkedinConfig from './auth/linkedinAuth';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import connectDB from './config/database.config';


facebookConfig();
linkedinConfig();


connectDB()

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



app.use('/users', indexRouter);
app.use('/', usersRouter);


app.use(function (req, res, next) {
    next(createError(404));
  });
export default app;



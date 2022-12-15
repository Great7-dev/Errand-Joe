"use strict";
// import express from 'express';
// import GoogleStrategy from 'passport-google-oauth20';
// import {User} from  '../models/userModel';
// import passport from 'passport';
// import dotenv from 'dotenv';
// dotenv.config();
// const clientId = process.env.CLIENT_ID;
// const clientSecreT = process.env.CLIENT_SECRET;
// const googleAuth = function (passport: string) {
//     passport.use(new GoogleStrategy({
//         clientID: clientId,
//         clientSecret: clientSecreT,
//         callbackURL: "http://localhost:3000/google/callback"
//     }, (accessToken, refreshToken, profile, done) => {
//         console.log(profile.emails[0].value);
//         // find if a user exist with this email or not
//         User.findOne({ email: profile.emails[0].value }).then((data) => {
//             if (data) {
//                 // user exists
//                 // update data
//                 // I am skipping that part here, may Update Later
//                 return done(null, data);
//             } else {
//                 // create a user
//                 new User({
//                   firstname: profile.name.givenName,
//                   lastname: profile.name.familyName,
//                   username: profile.displayName,
//                   email: profile.emails[0].value,
//                   googleId: profile.id,
//                   password: null,
//                   provider: 'google',
//                   isVerified: true,
//                 }).save(function (err, data) {
//                     return done(null, data);
//                 });
//             }
//         });
//     }
//     ));
//     passport.serializeUser(function (user, done) {
//         done(null, user.id);
//     });
//     passport.deserializeUser(function (id, done) {
//         User.findById(id, function (err, user) {
//             done(err, user);
//         });
//     });
// }
// export default googleAuth;

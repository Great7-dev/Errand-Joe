"use strict";
// import express, { Request, Response, NextFunction }from "express";
// import passport from "passport";
// const router = express.Router();
// import passportLocal from "passport-local";
// router.post('/login', (req, res, next) => {
//   passport.authenticate('local', {
//       failureRedirect: '/login',
//       successRedirect: '/profile',
//       failureFlash: true,
//   })(req, res, next);
// });
// // router.get('/logout', (req, res) => {
// //   req.logout();
// //   req.session.destroy(function (err) {
// //       res.redirect('/');
// //   });
// // });
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email',] }));
// router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect('/profile');
// });
// export default router;

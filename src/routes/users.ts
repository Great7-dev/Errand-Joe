import express from 'express';
import axios from 'axios';
import { getGoogleAuthURL, getTokens } from '../auth/googleAuth';
import jwt from 'jsonwebtoken';
import passport from 'passport';
const router = express.Router()

const COOKIE_NAME: string|any = process.env.COOKIE_NAME;
const JWT_SEC:string|any = process.env.JWT_SEC;
const SERVER_ROOT_URI: string|any = process.env.SERVER_ROOT_URI;
const client_id: string|any= process.env.CLIENT_ID;
const redirectURI = "auth/google";

// Getting the Google auth URL
router.get("/auth/google/url", (req, res) => {
  return res.send(getGoogleAuthURL());
});

// Getting the user from Google with the code
router.get(`/${redirectURI}`, async (req, res) => {
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

router.get("/auth/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.send("Logged out");
});

//Facebook Login
router.get('/login-facebook',passport.authenticate('facebook'));
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.json('success');
  });
router.get('/failed', (req, res) => {
  res.send('failed');
});
router.get('/facebook/logout', (req, res) => {
  req.session.destroy(function(err){
    res.clearCookie('connect.sid');
    res.send('logout');
  });
});


//LinkedIn Login
router.get('/login-linkedin',
  passport.authenticate('linkedin', { scope:  ['r_emailaddress', 'r_liteprofile'] }),
  function(req, res){
    // The request will be redirected to LinkedIn for authentication, so this
    // function will not be called.
  });
  router.get('/auth/linkedin/callback', passport.authenticate('linkedin', {failureRedirect: '/login'}),
function(req, res) {
      // Successful authentication, redirect home.
      res.json('success');
});
router.get('/linkedin/logout', (req, res) => {
  req.session.destroy(function(err){
    res.clearCookie('connect.sid');
    res.send('logout');
  });
});

export default router;

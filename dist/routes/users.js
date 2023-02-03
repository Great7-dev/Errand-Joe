"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const googleAuth_1 = require("../auth/googleAuth");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
const COOKIE_NAME = process.env.COOKIE_NAME;
const JWT_SEC = process.env.JWT_SEC;
const SERVER_ROOT_URI = process.env.SERVER_ROOT_URI;
const client_id = process.env.CLIENT_ID;
const redirectURI = "auth/google";
// Getting the Google auth URL
router.get("/auth/google/url", (req, res) => {
    return res.send((0, googleAuth_1.getGoogleAuthURL)());
});
// Getting the user from Google with the code
router.get(`/${redirectURI}`, async (req, res) => {
    const code = req.query.code;
    const client_secret = process.env.CLIENT_SECRET;
    const { id_token, access_token } = await (0, googleAuth_1.getTokens)({
        code,
        clientId: client_id,
        clientSecret: client_secret,
        redirectUri: `${SERVER_ROOT_URI}/${redirectURI}`,
    });
    // Fetch the user's profile with the access token and bearer
    const googleUser = await axios_1.default
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
        headers: {
            Authorization: `Bearer ${id_token}`,
        },
    })
        .then((res) => res.data)
        .catch((error) => {
        console.error(`Failed to fetch user`);
        throw new Error(error.message);
    });
    const token = jsonwebtoken_1.default.sign(googleUser, JWT_SEC);
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
router.get('/login-facebook', passport_1.default.authenticate('facebook'));
router.get('/auth/facebook/callback', passport_1.default.authenticate('facebook', { failureRedirect: '/failed' }), function (req, res) {
    // Successful authentication, redirect home.
    res.json('success');
});
router.get('/failed', (req, res) => {
    res.send('failed');
});
router.get('/facebook/logout', (req, res) => {
    req.session.destroy(function (err) {
        res.clearCookie('connect.sid');
        res.send('logout');
    });
});
//LinkedIn Login
router.get('/login-linkedin', passport_1.default.authenticate('linkedin', { scope: ['r_emailaddress', 'r_liteprofile'] }), function (req, res) {
    // The request will be redirected to LinkedIn for authentication, so this
    // function will not be called.
});
router.get('/auth/linkedin/callback', passport_1.default.authenticate('linkedin', { failureRedirect: '/login' }), function (req, res) {
    // Successful authentication, redirect home.
    res.json('success');
});
router.get('/linkedin/logout', (req, res) => {
    req.session.destroy(function (err) {
        res.clearCookie('connect.sid');
        res.send('logout');
    });
});
exports.default = router;

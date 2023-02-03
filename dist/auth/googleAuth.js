"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokens = exports.getGoogleAuthURL = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const querystring_1 = __importDefault(require("querystring"));
const axios_1 = __importDefault(require("axios"));
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const app = (0, express_1.default)();
const COOKIE_NAME = process.env.COOKIE_NAME;
const JWT_SEC = process.env.JWT_SEC;
const SERVER_ROOT_URI = process.env.SERVER_ROOT_URI;
app.use((0, cors_1.default)({
    // Sets Access-Control-Allow-Origin to the UI URI
    origin: SERVER_ROOT_URI,
    // Sets Access-Control-Allow-Credentials to true
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({ secret: 'mysecret', resave: true,
    saveUninitialized: true }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.serializeUser(function (user, cb) {
    cb(null, user);
});
passport_1.default.deserializeUser(function (obj, cb) {
    cb(null, obj);
});
const client_id = process.env.CLIENT_ID;
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
    return `${rootUrl}?${querystring_1.default.stringify(options)}`;
}
exports.getGoogleAuthURL = getGoogleAuthURL;
function getTokens({ code, clientId, clientSecret, redirectUri, }) {
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
    return axios_1.default
        .post(url, querystring_1.default.stringify(values), {
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
exports.getTokens = getTokens;
// Getting the current user
app.get("/auth/me", (req, res) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(req.cookies[COOKIE_NAME], JWT_SEC);
        console.log("decoded", decoded);
        return res.send(decoded);
    }
    catch (err) {
        console.log(err);
        res.send(null);
    }
});
exports.default = app;

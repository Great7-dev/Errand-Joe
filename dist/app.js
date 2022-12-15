"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const querystring_1 = __importDefault(require("querystring"));
const axios_1 = __importDefault(require("axios"));
// import {google} from 'googleapis'
const index_1 = __importDefault(require("./routes/index"));
const users_1 = __importDefault(require("./routes/users"));
const database_config_1 = __importDefault(require("./config/database.config"));
// import { COOKIE_NAME } from './config/config';
(0, database_config_1.default)();
const COOKIE_NAME = process.env.COOKIE_NAME;
const JWT_SEC = process.env.JWT_SEC;
const SERVER_ROOT_URI = process.env.SERVER_ROOT_URI;
const app = (0, express_1.default)();
app.set('views', path_1.default.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');
app.use((0, cors_1.default)({
    // Sets Access-Control-Allow-Origin to the UI URI
    origin: SERVER_ROOT_URI,
    // Sets Access-Control-Allow-Credentials to true
    credentials: true,
}));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
const client_id = process.env.CLIENT_ID;
// const client_secret = process.env.CLIENT_SECRET;
app.use('/users', index_1.default);
app.use('/user', users_1.default);
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
// Getting login URL
app.get("/auth/google/url", (req, res) => {
    return res.send(getGoogleAuthURL());
});
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
// Getting the user from Google with the code
app.get(`/${redirectURI}`, async (req, res) => {
    const code = req.query.code;
    const client_secret = process.env.CLIENT_SECRET;
    const { id_token, access_token } = await getTokens({
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
// Getting the current user
app.get("/auth/me", (req, res) => {
    console.log("get me");
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
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
exports.default = app;

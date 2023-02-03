"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const passport_1 = __importDefault(require("passport"));
const passport_facebook_1 = __importDefault(require("passport-facebook"));
const FacebookStrategy = passport_facebook_1.default.Strategy;
passport_1.default.serializeUser(function (user, cb) {
    cb(null, user);
});
passport_1.default.deserializeUser(function (obj, cb) {
    cb(null, obj);
});
const CLIENT_ID_FB = process.env.CLIENT_ID_FB;
const CLIENT_SECRET_FB = process.env.CLIENT_SECRET_FB;
function facebookConfig() {
    passport_1.default.use(new FacebookStrategy({
        clientID: CLIENT_ID_FB,
        clientSecret: CLIENT_SECRET_FB,
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    }, function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }));
}
exports.default = facebookConfig;

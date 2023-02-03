"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const passport_1 = __importDefault(require("passport"));
const passport_linkedin_oauth2_1 = __importDefault(require("passport-linkedin-oauth2"));
const LinkedInStrategy = passport_linkedin_oauth2_1.default.Strategy;
const CLIENT_ID_LI = process.env.CLIENT_ID_LINKEDIN;
const CLIENT_SECRET_LI = process.env.CLIENT_SECRET_LINKEDIN;
function linkedinConfig() {
    passport_1.default.use(new LinkedInStrategy({
        clientID: CLIENT_ID_LI,
        clientSecret: CLIENT_SECRET_LI,
        callbackURL: "http://localhost:3000/auth/linkedin/callback",
        scope: ['r_emailaddress', 'r_liteprofile'],
    }, function (token, tokenSecret, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
            // To keep the example simple, the user's LinkedIn profile is returned to
            // represent the logged-in user. In a typical application, you would want
            // to associate the LinkedIn account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }));
}
exports.default = linkedinConfig;

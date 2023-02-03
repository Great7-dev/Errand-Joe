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
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const facebookAuth_1 = __importDefault(require("./auth/facebookAuth"));
const linkedinAuth_1 = __importDefault(require("./auth/linkedinAuth"));
const index_1 = __importDefault(require("./routes/index"));
const users_1 = __importDefault(require("./routes/users"));
const database_config_1 = __importDefault(require("./config/database.config"));
(0, facebookAuth_1.default)();
(0, linkedinAuth_1.default)();
(0, database_config_1.default)();
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
app.use('/users', index_1.default);
app.use('/', users_1.default);
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
exports.default = app;

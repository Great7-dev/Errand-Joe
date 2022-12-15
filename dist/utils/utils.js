"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.generateToken = exports.EditProfile = exports.LoginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.registerSchema = joi_1.default.object().keys({
    firstname: joi_1.default.string().required(),
    lastname: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    username: joi_1.default.string().required(),
    email: joi_1.default.string().trim().lowercase().required(),
    phonenumber: joi_1.default.string().required().length(11).pattern(/^[0-9]+$/),
    password: joi_1.default.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    confirm_password: joi_1.default.ref('password')
}).with('password', 'confirm_password');
exports.LoginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().trim().lowercase().required(),
    password: joi_1.default.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
});
exports.EditProfile = joi_1.default.object().keys({
    firstname: joi_1.default.string().lowercase(),
    lastname: joi_1.default.string(),
    address: joi_1.default.string(),
    email: joi_1.default.string(),
    phonenumber: joi_1.default.string().length(11).pattern(/^[0-9]+$/),
    password: joi_1.default.string().regex(/^[a-zA-Z0-9]{3,30}$/),
});
const generateToken = (user) => {
    const pass = process.env.JWT_SECRET;
    return jsonwebtoken_1.default.sign(user, pass, { expiresIn: '7d' });
};
exports.generateToken = generateToken;
exports.options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: ''
        }
    }
};

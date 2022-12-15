"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserInstance = new mongoose_1.default.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phonenumber: { type: String, required: true, },
    password: { type: String, required: true },
    isVerified: { type: Boolean, required: false },
    googleId: { type: String },
    provider: { type: String, required: true },
}, {
    timestamps: true
});
exports.User = mongoose_1.default.model('User', UserInstance);

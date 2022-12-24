"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfile = exports.LoginUser = exports.RegisterUser = void 0;
const uuid_1 = require("uuid");
const userModel_1 = require("../models/userModel");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const utils_1 = require("../utils/utils");
async function RegisterUser(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const validateResult = utils_1.registerSchema.validate(req.body, utils_1.options);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const duplicatEmail = await userModel_1.User.findOne({ email: req.body.email });
        if (duplicatEmail) {
            return res.status(409).json({
                msg: "Email has be used already"
            });
        }
        const duplicatePhone = await userModel_1.User.findOne({ phonenumber: req.body.phonenumber });
        if (duplicatePhone) {
            return res.status(409).json({
                msg: 'Phone number has been used already'
            });
        }
        const passwordHash = await bcryptjs_1.default.hash(req.body.password, 8);
        const record = await userModel_1.User.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            address: req.body.address,
            phonenumber: req.body.phonenumber,
            password: passwordHash
        });
        return res.status(200).json({
            message: "You have successfully signed up.",
            record
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'failed to register',
            route: '/register'
        });
    }
}
exports.RegisterUser = RegisterUser;
async function LoginUser(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const validateResult = utils_1.LoginSchema.validate(req.body, utils_1.options);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const user = await userModel_1.User.findOne({ email: req.body.email });
        const { id } = user;
        const token = (0, utils_1.generateToken)({ id });
        res.cookie('mytoken', token, { httpOnly: true });
        res.cookie('id', id, { httpOnly: true });
        const validUser = await bcryptjs_1.default.compare(req.body.password, user.password);
        if (!validUser) {
            res.status(401);
            res.json({ message: "incorrect password"
            });
        }
        if (validUser) {
            res.status(200);
            res.json({ message: "login successful",
                token,
                user
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500);
        res.json({
            message: 'failed to login',
            route: '/login'
        });
    }
}
exports.LoginUser = LoginUser;
async function UpdateProfile(req, res, next) {
    try {
        const { id } = req.params;
        // const id = req.params
        const { firstname, lastname, email, address, phonenumber, password } = req.body;
        const validateResult = utils_1.EditProfile.validate(req.body, utils_1.options);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const record = await userModel_1.User.findById(id);
        if (!record) {
            res.status(404).json({
                Error: "cannot find profile",
            });
        }
        const updaterecord = await userModel_1.User.findByIdAndUpdate(id, {
            firstname: firstname,
            lastname: lastname,
            email: email,
            address: address,
            phonenumber: phonenumber,
            password: password
        }, { new: true });
        res.status(200).json({
            message: 'you have successfully updated your profile',
            record: updaterecord
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'failed to update',
            route: '/update/:id'
        });
    }
}
exports.UpdateProfile = UpdateProfile;

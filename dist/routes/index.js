"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const router = express_1.default.Router();
router.get('/', (req, res, next) => {
    res.send('respond with a resource');
});
router.post('/register', userController_1.RegisterUser);
router.post('/login', userController_1.LoginUser);
// router.post('/auth/google', LoginUser)
router.put('/update/:id', userController_1.UpdateProfile);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const app = (0, express_1.default)();
router.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
});
exports.default = router;

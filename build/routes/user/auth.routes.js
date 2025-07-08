"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../middlewares/validate");
const auth_validation_1 = __importDefault(require("../../validations/user/auth.validation"));
const auth_controller_1 = __importDefault(require("../../controllers/user/auth.controller"));
const router = express_1.default.Router();
router.post("/signup", (0, validate_1.validate)(auth_validation_1.default.signup), auth_controller_1.default.signup);
router.post("/login", (0, validate_1.validate)(auth_validation_1.default.login), auth_controller_1.default.login);
exports.default = router;

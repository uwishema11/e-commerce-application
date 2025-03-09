"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const celebrate_1 = require("celebrate");
const user_1 = require("../controllers/user");
const user_2 = require("../validations/user");
const userRouter = express_1.default.Router();
userRouter.post("/auth/register", (0, celebrate_1.celebrate)({ body: user_2.userSchema }), user_1.registerUser);
exports.default = userRouter;

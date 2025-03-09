"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const user_1 = require("../services/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, email } = req.body;
        const isUser = yield (0, user_1.findUserByEmail)(email);
        if (isUser) {
            res.status(400).json({
                success: false,
                message: "User already exists",
            });
            return;
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        // const hashedConfirmPassword = await bcrypt.hash(confirm_password, salt);
        const body = Object.assign(Object.assign({}, req.body), { password: hashedPassword });
        const newUser = yield (0, user_1.addUser)(body);
        newUser.password = "";
        // newUser.confirm_password = '';
        yield (0, user_1.addUser)(newUser);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: newUser,
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
        return;
    }
});
exports.registerUser = registerUser;

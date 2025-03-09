"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userSchema = joi_1.default.object().keys({
    FirstName: joi_1.default.string().alphanum().required(),
    LastName: joi_1.default.string().alphanum().required(),
    email: joi_1.default.string().email().required(),
    role: joi_1.default.string(),
    password: joi_1.default.string()
        .required()
        .min(6)
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
        .strict()
    //   confirm_password: Joi.string().valid(Joi.ref("password")).required().strict(),
});

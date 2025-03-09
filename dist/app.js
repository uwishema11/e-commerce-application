"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const celebrate_1 = require("celebrate");
const morgan_1 = __importDefault(require("morgan"));
const user_js_1 = __importDefault(require("./routes/user.js"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use((0, celebrate_1.errors)());
app.use('/api/users', user_js_1.default);
exports.default = app;

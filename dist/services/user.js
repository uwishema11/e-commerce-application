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
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = exports.addUser = void 0;
const prismaClient_1 = require("../database/prismaClient");
const addUser = (newUser) => __awaiter(void 0, void 0, void 0, function* () {
    const registeredUser = yield prismaClient_1.prisma.user.create({
        data: {
            email: newUser.email,
            FirstName: newUser.FirstName,
            LastName: newUser.LastName,
            password: newUser.password,
            role: newUser.role,
            created_at: new Date(),
            updated_at: new Date(),
        },
    });
    return registeredUser;
});
exports.addUser = addUser;
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prismaClient_1.prisma.user.findUnique({
        where: {
            email,
        },
    });
    return user;
});
exports.findUserByEmail = findUserByEmail;

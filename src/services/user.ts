import { prisma } from "../database/prismaClient";
import { userType } from "../types/user";
import redis from "../config/redis";

export const addUser = async (newUser: userType) => {
  const registeredUser = await prisma.user.create({
    data: {
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      password: newUser.password,
      confirm_password: newUser.confirm_password,
      role: newUser.role,
    },
  });
  return registeredUser;
};

export const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
};

export const updateVerifiedUser = async (email: string) => {
  return await prisma.user.update({
    where: { email },
    data: {
      isVerified: true,
      status: "active",
      updated_at: new Date(),
    },
  });
};

export const updatePassword = async (email: string, password: string) => {
  return await prisma.user.update({
    where: { email },
    data: {
      password,
      updated_at: new Date(),
    },
  });
};

export const updateProfile = async (email: string, data: any) => {
  return await prisma.user.update({
    where: { email },
    data: {
      ...data,
      updated_at: new Date(),
    },
  });
};

export const updatePasswordToken = async (token: string) => {
  await redis.set(`reset_password_token`, token);
};

export const resetPassword = async (email: string, password: string) => {
  await prisma.user.update({
    where: { email },
    data: {
      password,
      updated_at: new Date(),
    },
  });

  await redis.del("reset_password_token");
};

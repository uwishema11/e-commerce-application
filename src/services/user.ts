import { prisma } from "../database/prismaClient";
import { userType } from "../types/user";

export const addUser = async (newUser: userType) => {
  const registeredUser = await prisma.user.create({
    data: {
      email: newUser.email,
      firstName: newUser.firstName, 
      lastName: newUser.lastName, 
      password: newUser.password,
      confirm_password: newUser.confirm_password,
      role: newUser.role,
      created_at: new Date(), 
      updated_at: new Date(), 
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

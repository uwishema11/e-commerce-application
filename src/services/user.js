import { prisma } from "../database/prismaClient.js";

export const addUser = async (newUser) => {
  const registeredUser = await prisma.user.create({
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
};

 export const getAllUsers = async () => {
  const users = await prisma.user.find();
  return users;
};

 export const findUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
};


export const findUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  return user;
};

export const updatePassword = async (email, newPassword) => {
  const updatedPassword = await prisma.user.update(
    { password: newPassword },
    {
      where: { email },
    }
  );
  return updatedPassword;
};
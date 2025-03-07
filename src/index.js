import app from "./app.js";
import { prisma } from "./database/prismaClient.js";
// import { prisma } from "./src/database/prismaClient.js";
const PORT = 3000;

async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database is connected!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

checkDatabaseConnection();
app.listen(PORT, () => console.log(`Server is learning on port ${PORT}`));

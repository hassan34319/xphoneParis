import { PrismaClient } from "@prisma/client";

let prismaInit: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prismaInit = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prismaInit = (global as any).prisma;
}

export const prisma = prismaInit;

// The purpose of this code is to ensure that there is only one instance of PrismaClient in the application, regardless of the environment. In a production environment, a new instance is created each time. In a development or testing environment, the same instance is reused if it already exists in the global scope. By doing this, it helps optimize resource usage and prevent issues that may arise from multiple client instances trying to access the same database.
//  (global as any).prisma is used to check if a prisma instance already exists in the global scope. If it doesn't exist, a new instance of PrismaClient is created and assigned to (global as any).prisma. The (global as any) ensures that TypeScript doesn't complain about accessing the prisma property on the global object.
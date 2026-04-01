import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  for (let i = 1; i <= 240; i++) {
    let association: string;

   if (i <= 25) {
      association = "DSEA";
  } else if (i <= 50) {
      association = "Link";
  }else if (i <= 75) {
      association = "Zephyr";
  }else if (i <= 100) {
      association = "Blueshell";
  }else if (i <= 125) {
      association = "Dorans";
  }else if (i <= 150) {
      association = "Paragon";
  } else {
      association = "Free";
  }
    await prisma.seat.create({
      data: {
        association: association,
      },
    });
  }
}

main();
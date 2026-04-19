import mongoose from "mongoose";
import dotenv from "dotenv";

// 🔥 IMPORTANT LINE
dotenv.config({ path: "./.env" });

import { Department } from "./src/models/department.model.js";
import { Role } from "./src/models/role.model.js";
import { AccountStatus } from "./src/models/accountStatus.model.js";

const seedData = async () => {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI); // debug

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ DB Connected");

    await Role.create([
      { name: "SUPER_ADMIN" },
      { name: "ADMIN" },
      { name: "USER" }
    ]);

    await Department.create([
      { name: "IT" },
      { name: "HR" }
    ]);

    await AccountStatus.create([
      { name: "ACTIVE" },
      { name: "INACTIVE" }
    ]);

    console.log("✅ Seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Error seeding:", error);
    process.exit(1);
  }
};

seedData();
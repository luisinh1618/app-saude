import "dotenv/config";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { hashPassword } from "../utils/crypto.js";

async function createAdmin() {
  const email = "admin@saude.com";
  const password = "123456";
  const now = new Date().toISOString();

  const existingAdmin = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingAdmin.length > 0) {
    console.log("Admin já existe.");
    return;
  }

  await db.insert(users).values({
    id: randomUUID(),
    name: "Administrador",
    email,
    password: await hashPassword(password),
    role: "admin",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });

  console.log("Admin criado com sucesso!");
  console.log("Email:", email);
  console.log("Senha:", password);
}

createAdmin();
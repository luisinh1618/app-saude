import { db } from "../db/index.js";
import { users, patients, doctors } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { hashPassword, comparePassword } from "../utils/crypto.js";
import { generateToken } from "../utils/token.js";

type RegisterData = {
  name: string;
  email: string;
  password: string;
  role: "patient" | "doctor" | "admin";
  phone?: string | undefined;
  birthDate?: string | undefined;
  address?: string | undefined;
  crm?: string | undefined;
  specialty?: string | undefined;
  biography?: string | undefined;
};

export async function registerUser(data: RegisterData) {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email));

  if (existingUser.length > 0) {
    throw new Error("Email já cadastrado");
  }

  const userId = randomUUID();
  const now = new Date().toISOString();

  const passwordHash = await hashPassword(data.password);

  await db.insert(users).values({
    id: userId,
    name: data.name,
    email: data.email,
    password: passwordHash,
    role: data.role,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });

  if (data.role === "patient") {
    await db.insert(patients).values({
      id: randomUUID(),
      userId,
      phone: data.phone,
      birthDate: data.birthDate,
      address: data.address,
    });
  }

  if (data.role === "doctor") {
    if (!data.crm) {
      throw new Error("CRM é obrigatório para médicos");
    }

    await db.insert(doctors).values({
      id: randomUUID(),
      userId,
      crm: data.crm,
      phone: data.phone,
      specialty: data.specialty,
      biography: data.biography,
      approvalStatus: "pending",
    });
  }

  const token = generateToken({
    id: userId,
    role: data.role,
  });

  return {
    token,
    user: {
      id: userId,
      name: data.name,
      email: data.email,
      role: data.role,
    },
  };
}

export async function loginUser(email: string, password: string) {
  const result = await db.select().from(users).where(eq(users.email, email));

  const user = result[0];

  if (!user) {
    throw new Error("Email ou senha inválidos");
  }

  if (!user.isActive) {
    throw new Error("Usuário bloqueado");
  }

  const passwordValid = await comparePassword(password, user.password);

  if (!passwordValid) {
    throw new Error("Email ou senha inválidos");
  }

  if (user.role === "doctor") {
    const doctorResult = await db
      .select()
      .from(doctors)
      .where(eq(doctors.userId, user.id));

    const doctor = doctorResult[0];

    if (doctor?.approvalStatus !== "approved") {
      throw new Error("Cadastro médico ainda não aprovado pelo admin");
    }
  }

  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
export async function getUserById(id: string) {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, id));

  const user = result[0];

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  return user;
}
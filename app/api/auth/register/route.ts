import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { userDb } from "@/lib/db";
import { createToken, hashPassword } from "@/lib/auth";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { email, password, name } = parsed.data;

  const existing = userDb.findByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const hashed = await hashPassword(password);

  const user = userDb.create({
    email,
    password: hashed,
    name,
  });

  const token = await createToken({ userId: user.id });

  const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } }, { status: 201 });
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}

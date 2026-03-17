import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "change_this_to_a_strong_secret",
);

export async function hashPassword(plaintext: string) {
  return bcrypt.hash(plaintext, 10);
}

export async function verifyPassword(plaintext: string, hash: string) {
  return bcrypt.compare(plaintext, hash);
}

export async function createToken(payload: object, expiresIn = "7d") {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as Record<string, unknown>;
}

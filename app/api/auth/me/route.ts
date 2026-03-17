import { NextRequest, NextResponse } from "next/server";

import { userDb } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const payload = await verifyToken(token);
    const userId = String(payload.userId ?? "");

    const user = userDb.findById(userId);

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      } 
    });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

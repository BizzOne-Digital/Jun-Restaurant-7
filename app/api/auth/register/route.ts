import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { rateLimit } from "@/lib/rate-limit";
import { jsonFromDbError } from "@/lib/api-db-error";

const BodySchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  password: z.string().min(8).max(128),
  phone: z.string().max(40).optional(),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  const limited = rateLimit(`register:${ip}`, 10, 60 * 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many registration attempts" }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid registration data" }, { status: 400 });
  }

  try {
    await connectDB();
    const exists = await User.findOne({ email: parsed.data.email.toLowerCase() });
    if (exists) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    await User.create({
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      passwordHash,
      phone: parsed.data.phone ?? "",
      role: "user",
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return jsonFromDbError(e, "Registration failed");
  }
}

import { NextRequest, NextResponse } from "next/server";

const NANGO_SECRET_KEY = "2da4345b-ad74-41c8-a01e-47c432583531";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  const res = await fetch("https://api.nango.dev/connect/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NANGO_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      end_user: { id: userId },
      allowed_integrations: [],
    }),
  });

  const data = await res.json();
  const token = data.token || data.data?.token || null;
  return NextResponse.json({ token });
}
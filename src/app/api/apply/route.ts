import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = "re_dv9CbBi4_GBVnVJ9oPKi19Ygntg5GBjRR";

export async function POST(req: NextRequest) {
  const { name, email, linkedin, why, role } = await req.json();

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "AutoEmpire AI <onboarding@resend.dev>",
      to: ["autoempire.ai123@gmail.com"],
      subject: `New Application — ${role} — ${name}`,
      text: `New job application received!\n\nRole: ${role}\nName: ${name}\nEmail: ${email}\nLinkedIn: ${linkedin || "Not provided"}\n\nWhy they want to join:\n${why}`,
    }),
  });

  return NextResponse.json({ success: true });
}
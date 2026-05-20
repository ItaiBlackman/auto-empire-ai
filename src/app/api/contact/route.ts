import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = "re_dv9CbBi4_GBVnVJ9oPKi19Ygntg5GBjRR";

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "AutoEmpire AI <onboarding@resend.dev>",
      to: ["autoempire.ai123@gmail.com"],
      subject: `New Contact Form Submission — ${subject}`,
      text: `New contact form submission received!\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    }),
  });

  return NextResponse.json({ success: true });
}

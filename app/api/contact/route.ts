import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { checkRateLimit, getIp, rateLimiters } from "@/lib/ratelimit";

const requiredEnvVars = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
];

const ensureEnv = () => {
  for (const key of requiredEnvVars) {
    if (!process.env[key]) {
      throw new Error(`Missing SMTP configuration: ${key}`);
    }
  }
};

const createTransporter = () => {
  ensureEnv();

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

type ContactSubmission = {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  submittedAt: string;
};

const sanitize = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

const sendDiscordNotification = async (submission: ContactSubmission) => {
  const webhookUrl = process.env.CONTACT_DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return;
  }

  const truncate = (text: string, max = 1800) =>
    text.length > max ? `${text.slice(0, max - 1)}…` : text;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: "📩 New industry inquiry received",
        embeds: [
          {
            title: submission.subject || "Industry Inquiry",
            color: 0xff914d,
            description: truncate(submission.message || "No message provided."),
            fields: [
              { name: "Name", value: submission.name, inline: true },
              { name: "Email", value: submission.email, inline: true },
              { name: "Company", value: submission.company || "N/A", inline: true },
            ],
            timestamp: submission.submittedAt,
          },
        ],
      }),
    });
  } catch (error) {
    console.error("Discord webhook error", error);
  }
};

export async function POST(request: NextRequest) {
  const rateLimitResponse = await checkRateLimit(rateLimiters.contact, getIp(request));
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const formData = await request.formData();
    const name = sanitize(formData.get("name"));
    const email = sanitize(formData.get("email"));
    const company = sanitize(formData.get("company"));
    const subject = sanitize(formData.get("subject"));
    const message = sanitize(formData.get("message"));

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const submittedAt = new Date().toISOString();
    const submission: ContactSubmission = {
      name,
      email,
      company,
      subject,
      message,
      submittedAt,
    };

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.RECIPIENT_EMAIL || process.env.SMTP_USER,
      replyTo: email,
      subject: `Industry Inquiry: ${subject}`,
      text: `New contact request from ${submission.name} (${submission.email})\n\nCompany: ${
        submission.company || "N/A"
      }\nSubject: ${submission.subject}\n\nMessage:\n${submission.message}\n\nSubmitted at: ${submission.submittedAt}`,
    };

    await transporter.sendMail(mailOptions);
    await sendDiscordNotification(submission);

    return NextResponse.json({ message: "Message sent" }, { status: 200 });
  } catch (error) {
    console.error("Contact form error", error);

    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("missing smtp configuration")
    ) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

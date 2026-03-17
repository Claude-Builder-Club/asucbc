import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { checkRateLimit, getIp, rateLimiters } from "@/lib/ratelimit";

// Email routing per position
const POSITION_EMAILS: Record<string, { to: string[]; cc?: string[] }> = {
  business: {
    to: ["ericli@asu.edu"],
    cc: ["yuvambh@gmail.com"],
  },
  technology: {
    to: ["tet@tet.moe", "shivenshekar01@gmail.com"],
    cc: ["yuvambh@gmail.com"],
  },
  industry: {
    to: ["tmavunga@tbird.asu.edu", "akok2@asu.edu", "shivenshekar01@gmail.com", "favarzam@asu.edu"],
    cc: ["yuvambh@gmail.com"],
  },
  operations: {
    to: ["shivenshekar01@gmail.com", "sjulaka7@asu.edu"],
    cc: ["yuvambh@gmail.com"],
  },
  hackathon: {
    to: ["shivenshekar01@gmail.com", "tet@tet.moe"],
    cc: ["yuvambh@gmail.com"],
  },
};

const POSITION_LABELS: Record<string, string> = {
  business: "Business",
  technology: "Technology",
  industry: "Industry",
  operations: "Operations",
  hackathon: "Hackathon",
};

const requiredEnvVars = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];

const ensureEnv = () => {
  for (const key of requiredEnvVars) {
    if (!process.env[key]) throw new Error(`Missing SMTP configuration: ${key}`);
  }
};

const createTransporter = () => {
  ensureEnv();
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sanitize = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

// ─── Admin notification email ─────────────────────────────────────────────────

function buildAdminEmailHtml(params: {
  fullName: string;
  email: string;
  phone: string;
  website: string;
  github: string;
  linkedin: string;
  positions: string[];
  submittedAt: string;
}) {
  const { fullName, email, phone, website, github, linkedin, positions, submittedAt } = params;
  const positionLabels = positions.map((p) => POSITION_LABELS[p] ?? p).join(", ");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h1 style="color: #ff9b7a; margin: 0; font-size: 22px;">New Officer Application</h1>
    <p style="color: #aaa; margin: 8px 0 0; font-size: 14px;">ASU Claude Builder Club : ${positionLabels}</p>
  </div>

  <div style="background: #f9f9f9; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
    <h2 style="margin: 0 0 16px; font-size: 16px; color: #555;">Applicant Details</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 8px 0; color: #888; font-size: 13px; width: 120px;">Full Name</td><td style="padding: 8px 0; font-weight: 600;">${fullName}</td></tr>
      <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #cc785c;">${email}</a></td></tr>
      <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Phone</td><td style="padding: 8px 0;">${phone}</td></tr>
      <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">LinkedIn</td><td style="padding: 8px 0;"><a href="${linkedin.startsWith("http") ? linkedin : "https://" + linkedin}" style="color: #cc785c;">${linkedin}</a></td></tr>
      ${github ? `<tr><td style="padding: 8px 0; color: #888; font-size: 13px;">GitHub</td><td style="padding: 8px 0;"><a href="${github.startsWith("http") ? github : "https://" + github}" style="color: #cc785c;">${github}</a></td></tr>` : ""}
      ${website ? `<tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Website</td><td style="padding: 8px 0;"><a href="${website}" style="color: #cc785c;">${website}</a></td></tr>` : ""}
      <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Applied For</td><td style="padding: 8px 0; font-weight: 600; color: #cc785c;">${positionLabels}</td></tr>
    </table>
  </div>

  <p style="color: #999; font-size: 12px; text-align: center;">Submitted on ${new Date(submittedAt).toLocaleString("en-US", { timeZone: "America/Phoenix" })} (MST) · ASU Claude Builder Club</p>
</body>
</html>
  `.trim();
}

function buildAdminEmailText(params: {
  fullName: string;
  email: string;
  phone: string;
  website: string;
  github: string;
  linkedin: string;
  positions: string[];
  submittedAt: string;
}) {
  const positionLabels = params.positions.map((p) => POSITION_LABELS[p] ?? p).join(", ");
  return `New Officer Application : ${positionLabels}

Applicant: ${params.fullName}
Email: ${params.email}
Phone: ${params.phone}
LinkedIn: ${params.linkedin}${params.github ? `\nGitHub: ${params.github}` : ""}${params.website ? `\nWebsite: ${params.website}` : ""}
Applied For: ${positionLabels}

Submitted: ${new Date(params.submittedAt).toLocaleString("en-US", { timeZone: "America/Phoenix" })} MST
`;
}

// ─── Applicant confirmation email ─────────────────────────────────────────────

function buildApplicantEmailHtml(params: {
  fullName: string;
  positions: string[];
  submittedAt: string;
}) {
  const { fullName, positions, submittedAt } = params;
  const positionLabels = positions.map((p) => POSITION_LABELS[p] ?? p).join(" & ");
  const firstName = fullName.split(" ")[0];

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h1 style="color: #ff9b7a; margin: 0; font-size: 22px;">Application Received!</h1>
    <p style="color: #aaa; margin: 8px 0 0; font-size: 14px;">ASU Claude Builder Club</p>
  </div>

  <div style="background: #f9f9f9; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
    <p style="margin: 0 0 12px; font-size: 15px;">Hey ${firstName},</p>
    <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.6; color: #555;">
      Thanks for applying to the <strong>ASU Claude Builder Club</strong>! We've received your application for the <strong style="color: #cc785c;">${positionLabels}</strong> position${positions.length > 1 ? "s" : ""}.
    </p>
    <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.6; color: #555;">
      Our team will review your application and reach out to you within <strong>5 business days</strong>.
    </p>
    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #555;">
      In the meantime, feel free to check out our website or reach out if you have any questions.
    </p>
  </div>

  <div style="text-align: center; margin: 24px 0;">
    <a href="https://claudebuilder.club" style="display: inline-block; background: #cc785c; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">Visit our website</a>
  </div>

  <p style="color: #999; font-size: 12px; text-align: center;">Submitted on ${new Date(submittedAt).toLocaleString("en-US", { timeZone: "America/Phoenix" })} (MST) · ASU Claude Builder Club</p>
</body>
</html>
  `.trim();
}

function buildApplicantEmailText(params: {
  fullName: string;
  positions: string[];
  submittedAt: string;
}) {
  const positionLabels = params.positions.map((p) => POSITION_LABELS[p] ?? p).join(" & ");
  const firstName = params.fullName.split(" ")[0];
  return `Hey ${firstName},

Thanks for applying to the ASU Claude Builder Club! We've received your application for the ${positionLabels} position${params.positions.length > 1 ? "s" : ""}.

Our team will review your application and reach out to you within 5 business days.

Visit us at https://claudebuilder.club

Submitted: ${new Date(params.submittedAt).toLocaleString("en-US", { timeZone: "America/Phoenix" })} MST
`;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const rateLimitResponse = await checkRateLimit(rateLimiters.apply, getIp(request));
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const formData = await request.formData();

    const fullName = sanitize(formData.get("fullName"));
    const email = sanitize(formData.get("email"));
    const phone = sanitize(formData.get("phone"));
    const website = sanitize(formData.get("website"));
    const github = sanitize(formData.get("github"));
    const linkedin = sanitize(formData.get("linkedin"));
    const positionsRaw = sanitize(formData.get("positions"));
    const resumeEntry = formData.get("resume");

    if (!fullName || !email || !phone || !linkedin || !positionsRaw) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    let positions: string[];
    try {
      positions = JSON.parse(positionsRaw);
      if (!Array.isArray(positions) || positions.length === 0 || positions.length > 2) {
        return NextResponse.json({ error: "Select 1 or 2 positions" }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid positions data" }, { status: 400 });
    }

    for (const pos of positions) {
      if (!POSITION_EMAILS[pos]) {
        return NextResponse.json({ error: `Unknown position: ${pos}` }, { status: 400 });
      }
    }

    let attachment: { filename: string; content: Buffer } | null = null;
    if (resumeEntry && resumeEntry instanceof Blob) {
      const resumeFile = resumeEntry as File;
      const buffer = Buffer.from(await resumeFile.arrayBuffer());
      if (buffer.byteLength > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "Resume exceeds 10 MB limit" }, { status: 400 });
      }
      attachment = { filename: resumeFile.name, content: buffer };
    } else {
      return NextResponse.json({ error: "Resume is required" }, { status: 400 });
    }

    const transporter = createTransporter();
    const submittedAt = new Date().toISOString();
    const positionLabels = positions.map((p) => POSITION_LABELS[p] ?? p).join(" & ");

    // Merge recipients from all selected positions (deduplicated)
    const toSet = new Set<string>();
    const ccSet = new Set<string>();
    for (const pos of positions) {
      POSITION_EMAILS[pos].to.forEach((addr) => toSet.add(addr));
      POSITION_EMAILS[pos].cc?.forEach((addr) => ccSet.add(addr));
    }
    // cc should not overlap with to
    toSet.forEach((addr) => ccSet.delete(addr));

    const sharedParams = { fullName, email, phone, website, github, linkedin, positions, submittedAt };
    const attachments = attachment
      ? [{ filename: attachment.filename, content: attachment.content }]
      : [];

    // Single admin email covering all positions
    const adminMail = transporter.sendMail({
      from: process.env.SMTP_USER,
      to: Array.from(toSet).join(", "),
      cc: ccSet.size > 0 ? Array.from(ccSet).join(", ") : undefined,
      replyTo: email,
      subject: `Officer Application : ${positionLabels}: ${fullName}`,
      text: buildAdminEmailText(sharedParams),
      html: buildAdminEmailHtml(sharedParams),
      attachments,
    });

    // Confirmation email to the applicant
    const applicantMail = transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: `We received your application, ${fullName.split(" ")[0]}!`,
      text: buildApplicantEmailText({ fullName, positions, submittedAt }),
      html: buildApplicantEmailHtml({ fullName, positions, submittedAt }),
    });

    await Promise.all([adminMail, applicantMail]);

    return NextResponse.json({ message: "Application submitted" }, { status: 200 });
  } catch (error) {
    console.error("Apply form error", error);
    if (error instanceof Error && error.message.toLowerCase().includes("missing smtp")) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 503 });
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

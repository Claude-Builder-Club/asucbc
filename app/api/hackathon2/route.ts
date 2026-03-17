import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { checkRateLimit, getIp, rateLimiters } from "@/lib/ratelimit";

// Create a transporter for sending emails
const createTransporter = () => {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    throw new Error("SMTP configuration missing");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export async function POST(request: NextRequest) {
  const rateLimitResponse = await checkRateLimit(rateLimiters.hackathon2, getIp(request));
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const formData = await request.formData();

    // Extract form data
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const year = formData.get("year") as string;
    const lookingForTeam = formData.get("lookingForTeam") === "true";
    const major = formData.get("major") as string;
    const github = formData.get("github") as string;
    const linkedin = formData.get("linkedin") as string;
    const registrationType = (formData.get("registrationType") as string) || "hackathon";
    const isCaseCompetition = registrationType === "caseCompetition";

    // Validate required fields
    if (!firstName || !lastName || !email || !year || !major) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!isCaseCompetition && !github) {
      return NextResponse.json(
        { error: "GitHub username is required for hackathon registration" },
        { status: 400 }
      );
    }

    const registrationLabel = isCaseCompetition ? "Case Competition" : "Hackathon 2";

    const hookURL = process.env.DISCORD_HACKATHON2_WEBHOOK_URL;
    if (hookURL) {
      const discordFields = [
        { name: "Registration Type", value: registrationLabel, inline: true },
        { name: "First Name", value: firstName, inline: true },
        { name: "Last Name", value: lastName, inline: true },
        { name: "Email", value: email },
        { name: "Year", value: year, inline: true },
        { name: "Major", value: major, inline: true },
        ...(isCaseCompetition
          ? (linkedin ? [{ name: "LinkedIn", value: linkedin, inline: true }] : [])
          : [{ name: "GitHub", value: github, inline: true }]),
        { name: "Looking for Team", value: lookingForTeam ? "Yes" : "No", inline: true },
      ];

      // Send data to Discord webhook
      await fetch(hookURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: `New ${registrationLabel} Signup`,
          embeds: [
            {
              title: `New ${registrationLabel} Registration Received`,
              color: isCaseCompetition ? 3447003 : 16763802,
              fields: discordFields,
              timestamp: new Date().toISOString(),
              thumbnail: { url: "https://asucbc.vercel.app/staff/claude.svg" },
            },
          ],
          attachments: [],
        }),
      });
    }

    // Create email content
    const emailContent = `
New ${registrationLabel} Registration Received

Personal Information:
- First Name: ${firstName}
- Last Name: ${lastName}
- Email: ${email}
- Year: ${year}
- Major: ${major}
${isCaseCompetition
  ? `- LinkedIn: ${linkedin || "Not provided"}`
  : `- GitHub: ${github}`}
- Looking for Team: ${lookingForTeam ? "Yes" : "No"}

Registration submitted on: ${new Date().toLocaleString()}
    `;

    // Send data to Google Sheets via Apps Script webhook FIRST
    let sheetsSuccess = false;

    if (process.env.GOOGLE_APPS_SCRIPT_URL_HACKATHON2) {
      console.log("Attempting to save to Google Sheets...");
      const sheetsData = {
        registrationType: registrationLabel,
        firstName,
        lastName,
        email,
        year,
        lookingForTeam,
        major,
        github: github || "",
        linkedin: linkedin || "",
      };

      try {
        console.log("Sending data to:", process.env.GOOGLE_APPS_SCRIPT_URL_HACKATHON2);
        console.log("Data being sent:", sheetsData);

        const sheetsResponse = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL_HACKATHON2, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sheetsData),
        });

        const responseText = await sheetsResponse.text();
        console.log("Google Sheets response status:", sheetsResponse.status);
        console.log("Google Sheets response:", responseText);

        if (sheetsResponse.ok) {
          console.log("✅ Successfully saved to Google Sheets");
          sheetsSuccess = true;
        } else {
          console.error("❌ Failed to save to Google Sheets:", responseText);
        }
      } catch (sheetsError) {
        console.error("❌ Google Sheets integration error:", sheetsError);
      }
    } else {
      console.log(
        "⚠️ GOOGLE_APPS_SCRIPT_URL_HACKATHON2 not configured, skipping Sheets integration"
      );
    }

    // Only send email as backup if Sheets failed or wasn't configured
    if (!sheetsSuccess) {
      console.log(
        "📧 Sending email as backup since Sheets integration failed or not configured"
      );
      const transporter = createTransporter();

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: process.env.RECIPIENT_EMAIL || "shivenshekar01@gmail.com",
        subject: isCaseCompetition
          ? `🏆 New Case Competition Registration: ${firstName} ${lastName}`
          : `🚀 New Hackathon 2 Registration: ${firstName} ${lastName}`,
        text: emailContent,
      };

      await transporter.sendMail(mailOptions);
    } else {
      console.log("📧 Skipping email since Sheets integration succeeded");
    }

    return NextResponse.json(
      { message: `${registrationLabel} registration submitted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing hackathon 2 registration:", error);

    // If SMTP is not configured, return a more helpful error
    if (
      error instanceof Error &&
      error.message.includes("SMTP configuration missing")
    ) {
      return NextResponse.json(
        {
          error:
            "Email service not configured. Please contact the administrator.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
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

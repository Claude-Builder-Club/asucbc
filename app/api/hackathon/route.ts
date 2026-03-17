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
  const rateLimitResponse = await checkRateLimit(rateLimiters.hackathon, getIp(request));
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const formData = await request.formData();

    // Extract form data
    const track = formData.get("track") as string;
    const isAsuStudent = formData.get("isAsuStudent") === "true";
    const isAsuOnlineStudent = formData.get("isAsuOnlineStudent") === "true";
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const schoolEmail = formData.get("schoolEmail") as string;
    const year = formData.get("year") as string;
    const hackathonsParticipated = formData.get(
      "hackathonsParticipated"
    ) as string;
    const experienceLevel = formData.get("experienceLevel") as string;
    const dietaryRestrictions = formData.get("dietaryRestrictions") as string;

    // Validate required fields
    if (
      !track ||
      !firstName ||
      !lastName ||
      !schoolEmail ||
      !year ||
      !hackathonsParticipated ||
      !experienceLevel
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const hookURL = process.env.DISCORD_HACKATHON_WEBHOOK_URL;
    if (hookURL) {
      // Send data to Discord webhook
      await fetch(hookURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: "New Signup",
          embeds: [
            {
              title: "New Hackathon Registration Recieved",
              color: 16763802,
              fields: [
                { name: "First Name", value: firstName, inline: true },
                { name: "Last Name", value: lastName, inline: true },
                { name: "School Email", value: schoolEmail },
                { name: "Year", value: year, inline: true },
                { name: "Track", value: track, inline: true },
                { name: "ASU Student", value: isAsuStudent ? "Yes" : "No", inline: true },
                { name: "ASU Online Student", value: isAsuOnlineStudent ? "Yes" : "No", inline: true },
                { name: "Hackathons Participated", value: hackathonsParticipated, inline: true },
                { name: "Experience Level", value: experienceLevel, inline: true },
              ],
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
New Hackathon Registration Received

Personal Information:
- First Name: ${firstName}
- Last Name: ${lastName}
- School Email: ${schoolEmail}
- Year: ${year}
- Track: ${track}
- ASU Student: ${isAsuStudent ? "Yes" : "No"}
- ASU Online Student: ${isAsuOnlineStudent ? "Yes" : "No"}
- Hackathons Participated: ${hackathonsParticipated}
- Experience Level: ${experienceLevel}

Additional Information:
- Dietary Restrictions: ${dietaryRestrictions || "None"}

Registration submitted on: ${new Date().toLocaleString()}
    `;

    // Send email
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.RECIPIENT_EMAIL || "shivenshekar01@gmail.com",
      subject: `🎃 New Hackathon Registration: ${firstName} ${lastName}`,
      text: emailContent,
    };

    // Send data to Google Sheets via Apps Script webhook FIRST
    let sheetsSuccess = false;

    if (process.env.GOOGLE_APPS_SCRIPT_URL) {
      console.log("Attempting to save to Google Sheets...");
      const sheetsData = {
        track,
        isAsuStudent,
        isAsuOnlineStudent,
        firstName,
        lastName,
        schoolEmail,
        year,
        hackathonsParticipated,
        experienceLevel,
        dietaryRestrictions: dietaryRestrictions || "",
      };

      try {
        console.log("Sending data to:", process.env.GOOGLE_APPS_SCRIPT_URL);
        console.log("Data being sent:", sheetsData);

        const sheetsResponse = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL, {
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
        "⚠️ GOOGLE_APPS_SCRIPT_URL not configured, skipping Sheets integration"
      );
    }

    // Only send email as backup if Sheets failed or wasn't configured
    if (!sheetsSuccess) {
      console.log(
        "📧 Sending email as backup since Sheets integration failed or not configured"
      );
      await transporter.sendMail(mailOptions);
    } else {
      console.log("📧 Skipping email since Sheets integration succeeded");
    }

    return NextResponse.json(
      { message: "Hackathon registration submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing hackathon registration:", error);

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

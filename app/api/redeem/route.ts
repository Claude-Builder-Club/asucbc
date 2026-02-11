import { NextRequest, NextResponse } from "next/server";

interface RedeemFormData {
  firstName: string;
  lastName: string;
  asuEmail: string;
  hasReceivedCredits: boolean;
  orgId: string;
  latitude: number;
  longitude: number;
}

// Calculate distance between two coordinates in feet
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceInMeters = R * c;
  const distanceInFeet = distanceInMeters * 3.28084; // Convert meters to feet

  return distanceInFeet;
}

// Send data to Discord webhook
async function sendToDiscordWebhook(
  webhookUrl: string,
  formData: RedeemFormData,
  status: "SUCCESS" | "FAILED_ATTEMPT",
  failureReason?: string,
  distance?: number
): Promise<boolean> {
  try {
    const isSuccess = status === "SUCCESS";
    const embedColor = isSuccess ? 5763719 : 15548997; // Green for success, Red for failure
    const contentPrefix = isSuccess ? "✅ SUCCESS" : "❌ FAILED_ATTEMPT";

    const fields = [
      { name: "Status", value: status, inline: true },
      { name: "First Name", value: formData.firstName, inline: true },
      { name: "Last Name", value: formData.lastName, inline: true },
      { name: "ASU Email", value: formData.asuEmail },
      {
        name: "Has Received Credits",
        value: formData.hasReceivedCredits ? "Yes" : "No",
        inline: true,
      },
      { name: "Claude Org ID", value: formData.orgId },
      {
        name: "Location",
        value: `Lat: ${formData.latitude.toFixed(6)}, Long: ${formData.longitude.toFixed(6)}`,
      },
      {
        name: "Google Maps",
        value: `[View on Map](https://www.google.com/maps?q=${formData.latitude},${formData.longitude})`,
      },
    ];

    // Add distance field if provided
    if (distance !== undefined) {
      fields.push({
        name: "Distance from Event",
        value: `${distance.toFixed(2)} feet`,
        inline: true,
      });
    }

    // Add failure reason if provided
    if (failureReason) {
      fields.push({
        name: "Failure Reason",
        value: failureReason,
        inline: false,
      });
    }

    // Prepare JSON data for content
    const jsonData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      asuEmail: formData.asuEmail,
      hasReceivedCredits: formData.hasReceivedCredits ? "Yes" : "No",
      claudeOrgId: formData.orgId,
      campus: "Tempe",
      meetingDate: new Date().toISOString().split('T')[0],
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: `${contentPrefix} - Claude Credits Redemption Request\n\`\`\`json\n${JSON.stringify(jsonData, null, 2)}\n\`\`\``,
        embeds: [
          {
            title: `Claude API Credits Redemption - ${status}`,
            color: embedColor,
            fields,
            timestamp: new Date().toISOString(),
            thumbnail: { url: "https://asucbc.vercel.app/staff/claude.svg" },
          },
        ],
        attachments: [],
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Error sending to Discord webhook:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData: RedeemFormData = await request.json();

    // Validate required fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.asuEmail ||
      formData.hasReceivedCredits === undefined ||
      !formData.orgId ||
      formData.latitude === null ||
      formData.latitude === undefined ||
      formData.longitude === null ||
      formData.longitude === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get Discord webhook URLs (needed for both success and failure tracking)
    const webhookUrls = process.env.DISCORD_REDEEM_WEBHOOK_URLS
      ? process.env.DISCORD_REDEEM_WEBHOOK_URLS.split(",").map((url) =>
          url.trim()
        )
      : [];

    // Validate email ends with .edu
    if (!formData.asuEmail.toLowerCase().endsWith(".edu")) {
      // Send FAILED_ATTEMPT webhook for invalid email
      if (webhookUrls.length > 0 && webhookUrls[0]) {
        await sendToDiscordWebhook(
          webhookUrls[0],
          formData,
          "FAILED_ATTEMPT",
          `Invalid email: ${formData.asuEmail} (does not end with .edu)`
        );
      }
      return NextResponse.json(
        { error: "Email must end with .edu" },
        { status: 400 }
      );
    }

    // Validate location
    const eventLat = parseFloat(process.env.EVENT_GPS_LAT || "0");
    const eventLong = parseFloat(process.env.EVENT_GPS_LONG || "0");

    if (!eventLat || !eventLong) {
      console.error("EVENT_GPS_LAT or EVENT_GPS_LONG not configured");
      return NextResponse.json(
        { error: "Location verification not configured" },
        { status: 503 }
      );
    }

    // Calculate distance
    const distance = calculateDistance(
      formData.latitude,
      formData.longitude,
      eventLat,
      eventLong
    );

    // Check if webhooks are configured
    if (webhookUrls.length === 0) {
      console.error("No Discord webhook URLs configured");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 503 }
      );
    }

    // Check if within 150 feet
    const MAX_DISTANCE_FEET = 150;
    if (distance > MAX_DISTANCE_FEET) {
      console.log(
        `Location verification failed: ${distance.toFixed(2)} feet away (max: ${MAX_DISTANCE_FEET} feet)`
      );

      // Send FAILED_ATTEMPT webhook
      const failureReason = `Location too far: ${distance.toFixed(2)} feet from event (max: ${MAX_DISTANCE_FEET} feet)`;
      for (const webhookUrl of webhookUrls) {
        if (webhookUrl) {
          await sendToDiscordWebhook(
            webhookUrl,
            formData,
            "FAILED_ATTEMPT",
            failureReason,
            distance
          );
          break; // Only send to first webhook for failed attempts
        }
      }

      return NextResponse.json(
        {
          error:
            "You seem to be too far from the meeting location to redeem credits. Please try again when you arrive.",
        },
        { status: 403 }
      );
    }

    console.log(
      `Location verified: ${distance.toFixed(2)} feet from event location`
    );

    // Try sending SUCCESS webhook to webhooks sequentially until one succeeds
    let success = false;
    for (const webhookUrl of webhookUrls) {
      if (webhookUrl) {
        const result = await sendToDiscordWebhook(
          webhookUrl,
          formData,
          "SUCCESS",
          undefined,
          distance
        );
        if (result) {
          success = true;
          console.log(`Successfully sent to webhook: ${webhookUrl}`);
          break; // Stop after first successful send
        } else {
          console.log(`Failed to send to webhook: ${webhookUrl}`);
        }
      }
    }

    if (!success) {
      console.error("All webhook attempts failed");
      return NextResponse.json(
        { error: "Failed to process your request. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message:
          "Your request has been submitted successfully. We will process your redemption shortly.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing redemption request:", error);
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

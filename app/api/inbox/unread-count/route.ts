import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const { rows } = await pool.query(
    `SELECT COUNT(*) AS count
     FROM messages m
     WHERE NOT EXISTS (
       SELECT 1 FROM message_reads mr
       WHERE mr.message_id = m.id AND mr.user_id = $1
     )`,
    [userId]
  );

  return NextResponse.json({ count: parseInt(rows[0].count, 10) });
}

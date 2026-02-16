import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const { rows } = await pool.query(
    `SELECT COUNT(*) AS count
     FROM messages m
     WHERE NOT EXISTS (
       SELECT 1 FROM message_reads mr
       WHERE mr.message_id = m.id AND mr.user_id = $1
     )`,
    [userId],
  );

  return NextResponse.json({ count: parseInt(rows[0].count, 10) });
}

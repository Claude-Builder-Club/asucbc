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
    `SELECT m.id, m.title, m.body, m.created_at,
            u.name AS sender_name,
            CASE WHEN mr.id IS NOT NULL THEN TRUE ELSE FALSE END AS is_read
     FROM messages m
     LEFT JOIN "user" u ON u.id = m.sender_id
     LEFT JOIN message_reads mr ON mr.message_id = m.id AND mr.user_id = $1
     ORDER BY m.created_at DESC`,
    [userId],
  );

  return NextResponse.json(rows);
}

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const { messageId } = await req.json();

  if (!messageId) {
    return NextResponse.json({ error: "Missing messageId" }, { status: 400 });
  }

  await pool.query(
    `INSERT INTO message_reads (user_id, message_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, message_id) DO NOTHING`,
    [userId, messageId],
  );

  return NextResponse.json({ success: true });
}

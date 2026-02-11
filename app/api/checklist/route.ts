import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const { rows } = await pool.query(
    `SELECT ci.id, ci.label, COALESCE(cp.completed, FALSE) AS completed
     FROM checklist_items ci
     LEFT JOIN checklist_progress cp
       ON cp.item_id = ci.id AND cp.user_id = $1
     WHERE ci.active = TRUE
     ORDER BY ci.sort_order ASC`,
    [userId]
  );

  return NextResponse.json(rows);
}

export async function PATCH(req: NextRequest) {
  const { itemId, completed, userId } = await req.json();

  if (!itemId || typeof completed !== "boolean" || !userId) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { rows } = await pool.query(
    `INSERT INTO checklist_progress (user_id, item_id, completed, completed_at)
     VALUES ($1, $2, $3, CASE WHEN $3 THEN NOW() ELSE NULL END)
     ON CONFLICT (user_id, item_id)
     DO UPDATE SET completed = $3, completed_at = CASE WHEN $3 THEN NOW() ELSE NULL END
     RETURNING *`,
    [userId, itemId, completed]
  );

  return NextResponse.json(rows[0]);
}

// app/api/check-username/route.js
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null)
    if (!body || typeof body.username !== "string") {
      return NextResponse.json({ error: "username required" }, { status: 400 })
    }

    const SUPABASE_URL = process.env.SUPABASE_URL
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Server misconfiguration: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" },
        { status: 500 }
      )
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Normalize username the same way client does
    const candidate = body.username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, 30)

    const { data, error } = await supabase
      .from("profiles")
      .select("id", { count: "exact" })
      .eq("username", candidate)
      .limit(1)

    if (error) {
      return NextResponse.json({ error: "database error" }, { status: 500 })
    }

    const available = !data || data.length === 0
    return NextResponse.json({ available, username: candidate }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: "invalid request" }, { status: 400 })
  }
}

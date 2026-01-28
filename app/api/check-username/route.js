// app/api/check-username/route.js
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Optional: explicitly run this route in Node (not edge) if you use service role key
// export const runtime = "nodejs"

export async function POST(req) {
  try {
    // Validate request body
    const body = await req.json().catch(() => null)
    if (!body || typeof body.username !== "string") {
      return NextResponse.json({ error: "username required" }, { status: 400 })
    }

    // Read env vars at runtime and validate
    const SUPABASE_URL = process.env.SUPABASE_URL
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      // Fail fast with a clear message so you can spot missing env vars in build logs
      return NextResponse.json(
        { error: "Server misconfiguration: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" },
        { status: 500 }
      )
    }

    // Create client inside handler to avoid throwing at module import time
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      // ensure we use node fetch if needed; supabase-js will use global fetch in Node 18+
      // no special options required here in most setups
    })

    // Normalize username
    const candidate = body.username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, 30)

    // Query DB for existing username
    const { data, error } = await supabase
      .from("profiles")
      .select("id", { count: "exact" })
      .eq("username", candidate)
      .limit(1)

    if (error) {
      return NextResponse.json({ error: "database error" }, { status: 500 })
    }

    const available = !data || data.length === 0
    return NextResponse.json({ available, username: candidate })
  } catch (err) {
    // Generic fallback
    return NextResponse.json({ error: "invalid request" }, { status: 400 })
  }
}

// app/api/check-username/route.js
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export async function POST(req) {
  try {
    const { username, age } = await req.json()

    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "username required" }, { status: 400 })
    }

    // optional age validation server-side
    if (age !== undefined) {
      const ageNum = Number(age)
      if (Number.isNaN(ageNum) || ageNum < 18) {
        return NextResponse.json({ error: "age must be 18 or older" }, { status: 400 })
      }
    }

    // normalize username
    const candidate = username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, 30)

    // check profiles table for existing username
    const { data, error, count } = await supabase
      .from("profiles")
      .select("id", { count: "exact" })
      .eq("username", candidate)
      .limit(1)

    if (error) {
      return NextResponse.json({ error: "db error" }, { status: 500 })
    }

    const available = !data || data.length === 0
    return NextResponse.json({ available, username: candidate })
  } catch (err) {
    return NextResponse.json({ error: "invalid request" }, { status: 400 })
  }
}

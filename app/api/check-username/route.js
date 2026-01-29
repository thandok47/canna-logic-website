import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(req) {
  try {
    const { username } = await req.json()

    if (!username) {
      return NextResponse.json({ error: "No username provided" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (data.length > 0) {
      return NextResponse.json({ available: false }, { status: 200 })
    }

    return NextResponse.json({ available: true }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

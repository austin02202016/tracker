import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.apikey?.split("|")[0] || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.apikey?.split("|")[1] || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type DailyReview = {
  id: number
  date: string
  transcript: string | null
  lift: boolean | null
  content: boolean | null
  highlights: string | null
  "730_alarm": boolean | null
  "1045_bed": boolean | null
  Test: boolean | null
}

export type Streak = {
  name: string
  current: number
  longest: number
}

export type ConsistencyMetric = {
  name: string
  percentage: number
  trend: "up" | "down" | "neutral"
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { DailyReview } from "@/lib/supabase"

interface HabitHeatmapProps {
  title: string
  reviews: DailyReview[]
  habitKey: keyof DailyReview
  description?: string
}

export function HabitHeatmap({ title, reviews, habitKey, description }: HabitHeatmapProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)

  // Sort reviews by date (oldest first)
  const sortedReviews = [...reviews].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Get the last 30 days of data
  const last30Days = sortedReviews.slice(-30)

  // Calculate streak
  let currentStreak = 0
  for (let i = last30Days.length - 1; i >= 0; i--) {
    if (last30Days[i][habitKey] === true) {
      currentStreak++
    } else {
      break
    }
  }

  // Calculate completion rate
  const completedDays = last30Days.filter((review) => review[habitKey] === true).length
  const completionRate = Math.round((completedDays / last30Days.length) * 100)

  // Group by week for display
  const weeks: DailyReview[][] = []
  for (let i = 0; i < last30Days.length; i += 7) {
    weeks.push(last30Days.slice(i, i + 7))
  }

  // Fill in any missing days in the last week
  const lastWeek = weeks[weeks.length - 1]
  if (lastWeek && lastWeek.length < 7) {
    const lastDate = new Date(lastWeek[lastWeek.length - 1].date)
    for (let i = lastWeek.length; i < 7; i++) {
      const nextDate = new Date(lastDate)
      nextDate.setDate(lastDate.getDate() + (i - lastWeek.length + 1))
      lastWeek.push({
        id: -i,
        date: nextDate.toISOString().split("T")[0],
        transcript: null,
        lift: null,
        content: null,
        highlights: null,
        "730_alarm": null,
        "1045_bed": null,
        Test: null,
      })
    }
  }

  // Get color based on habit completion
  const getColor = (review: DailyReview) => {
    if (review[habitKey] === null) return "bg-gray-800"
    if (review[habitKey] === true) return "bg-emerald-600"
    return "bg-gray-700"
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  // Get day labels for the first column
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">{title}</CardTitle>
            {description && <p className="text-muted-foreground mt-1">{description}</p>}
          </div>
          <div className="flex items-center space-x-8 text-base">
            <div>
              <span className="font-bold text-xl">{currentStreak}</span>
              <span className="text-muted-foreground ml-2 font-medium">day streak</span>
            </div>
            <div>
              <span className="font-bold text-xl">{completionRate}%</span>
              <span className="text-muted-foreground ml-2 font-medium">completion</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <TooltipProvider>
          <div className="flex">
            {/* Day labels column */}
            <div className="flex flex-col mr-4 pt-2">
              {dayLabels.map((day, index) => (
                <div key={day} className="h-8 flex items-center justify-end text-sm text-muted-foreground font-medium">
                  {day}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="flex-1">
              <div className="flex flex-col space-y-2">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex space-x-2">
                    {week.map((day) => (
                      <Tooltip key={day.id}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "w-8 h-8 rounded-md cursor-pointer transition-colors",
                              getColor(day),
                              hoveredDate === day.date && "ring-2 ring-white",
                            )}
                            onMouseEnter={() => setHoveredDate(day.date)}
                            onMouseLeave={() => setHoveredDate(null)}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <div className="text-sm">
                            <div className="font-bold">{formatDate(day.date)}</div>
                            <div className="mt-1">
                              Status:{" "}
                              {day[habitKey] === null
                                ? "No data"
                                : day[habitKey] === true
                                  ? "Completed"
                                  : "Not completed"}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TooltipProvider>
        <div className="flex justify-between items-center mt-8 text-sm">
          <div className="font-medium">Last 30 days</div>
          <div className="flex items-center space-x-2">
            <span>Not completed</span>
            <div className="w-4 h-4 rounded-md bg-gray-700"></div>
            <div className="w-4 h-4 rounded-md bg-emerald-600"></div>
            <span>Completed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

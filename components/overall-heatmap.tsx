"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { DailyReview } from "@/lib/supabase"

interface OverallHeatmapProps {
  reviews: DailyReview[]
}

export function OverallHeatmap({ reviews }: OverallHeatmapProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)

  // Sort reviews by date (oldest first)
  const sortedReviews = [...reviews].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Get the last 30 days of data
  const last30Days = sortedReviews.slice(-30)

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

  // Count completed habits for each day
  const getCompletedCount = (review: DailyReview): number => {
    const habits = ["lift", "content", "730_alarm", "1045_bed", "Test"]
    return habits.filter((habit) => review[habit as keyof DailyReview] === true).length
  }

  // Get color based on number of completed habits
  const getColor = (review: DailyReview) => {
    const count = getCompletedCount(review)
    if (count === 0) return "bg-gray-800"
    if (count === 1) return "bg-emerald-900"
    if (count === 2) return "bg-emerald-800"
    if (count === 3) return "bg-emerald-700"
    if (count === 4) return "bg-emerald-600"
    return "bg-emerald-500" // All 5
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

  // Get list of completed habits
  const getCompletedHabits = (review: DailyReview): string[] => {
    const habitMap: Record<string, string> = {
      lift: "Workout",
      content: "Content Creation",
      "730_alarm": "7:30 Alarm",
      "1045_bed": "10:45 Bedtime",
      Test: "Test Habit",
    }

    return Object.entries(habitMap)
      .filter(([key]) => review[key as keyof DailyReview] === true)
      .map(([_, label]) => label)
  }

  // Get day labels for the first column
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold tracking-tight">Daily Habit Completion</CardTitle>
        <p className="text-muted-foreground">Track how many habit categories you complete each day</p>
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
                    {week.map((day) => {
                      const dayDate = new Date(day.date)
                      const dayOfWeek = dayDate.getDay() // 0 = Sunday, 6 = Saturday

                      return (
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
                          <TooltipContent side="top" align="center">
                            <div className="text-sm">
                              <div className="font-bold">{formatDate(day.date)}</div>
                              <div className="mt-1">Completed {getCompletedCount(day)} of 5 habits</div>
                              {getCompletedCount(day) > 0 && (
                                <div className="mt-1">
                                  <div className="font-semibold">Completed:</div>
                                  <ul className="list-disc pl-4 mt-1">
                                    {getCompletedHabits(day).map((habit, i) => (
                                      <li key={i}>{habit}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TooltipProvider>
        <div className="flex justify-between items-center mt-8 text-sm">
          <div className="font-medium">Last 30 days</div>
          <div className="flex items-center space-x-2">
            <span>0</span>
            <div className="w-4 h-4 rounded-md bg-gray-800"></div>
            <div className="w-4 h-4 rounded-md bg-emerald-900"></div>
            <div className="w-4 h-4 rounded-md bg-emerald-800"></div>
            <div className="w-4 h-4 rounded-md bg-emerald-700"></div>
            <div className="w-4 h-4 rounded-md bg-emerald-600"></div>
            <div className="w-4 h-4 rounded-md bg-emerald-500"></div>
            <span>5</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

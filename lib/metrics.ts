import type { DailyReview, Streak, ConsistencyMetric } from "./supabase"

export function calculateStreaks(reviews: DailyReview[]): Streak[] {
  // Sort reviews by date (newest first)
  const sortedReviews = [...reviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const habits = [
    { key: "lift", name: "Workout" },
    { key: "content", name: "Content Creation" },
    { key: "730_alarm", name: "7:30 Alarm" },
    { key: "1045_bed", name: "10:45 Bedtime" },
    { key: "Test", name: "Test Habit" },
  ]

  return habits.map((habit) => {
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    // Calculate current streak (consecutive days from today)
    for (const review of sortedReviews) {
      if (review[habit.key as keyof DailyReview] === true) {
        currentStreak++
      } else {
        break
      }
    }

    // Calculate longest streak
    for (const review of sortedReviews) {
      if (review[habit.key as keyof DailyReview] === true) {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 0
      }
    }

    return {
      name: habit.name,
      current: currentStreak,
      longest: longestStreak,
    }
  })
}

export function calculateConsistency(reviews: DailyReview[], days = 30): ConsistencyMetric[] {
  // Filter reviews to only include the last 'days' days
  const today = new Date()
  const cutoffDate = new Date()
  cutoffDate.setDate(today.getDate() - days)

  const recentReviews = reviews.filter((review) => new Date(review.date) >= cutoffDate)

  const previousCutoffDate = new Date(cutoffDate)
  previousCutoffDate.setDate(cutoffDate.getDate() - days)

  const previousReviews = reviews.filter(
    (review) => new Date(review.date) >= previousCutoffDate && new Date(review.date) < cutoffDate,
  )

  const habits = [
    { key: "lift", name: "Workout" },
    { key: "content", name: "Content Creation" },
    { key: "730_alarm", name: "7:30 Alarm" },
    { key: "1045_bed", name: "10:45 Bedtime" },
    { key: "Test", name: "Test Habit" },
  ]

  return habits.map((habit) => {
    // Calculate current percentage
    const completedDays = recentReviews.filter((review) => review[habit.key as keyof DailyReview] === true).length
    const percentage = recentReviews.length > 0 ? Math.round((completedDays / recentReviews.length) * 100) : 0

    // Calculate previous percentage for trend
    const previousCompletedDays = previousReviews.filter(
      (review) => review[habit.key as keyof DailyReview] === true,
    ).length
    const previousPercentage =
      previousReviews.length > 0 ? Math.round((previousCompletedDays / previousReviews.length) * 100) : 0

    // Determine trend
    let trend: "up" | "down" | "neutral" = "neutral"
    if (percentage > previousPercentage) {
      trend = "up"
    } else if (percentage < previousPercentage) {
      trend = "down"
    }

    return {
      name: habit.name,
      percentage,
      trend,
    }
  })
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

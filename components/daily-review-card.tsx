import type { DailyReview } from "@/lib/supabase"
import { formatDate } from "@/lib/metrics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"

interface DailyReviewCardProps {
  review: DailyReview
}

export function DailyReviewCard({ review }: DailyReviewCardProps) {
  const habits = [
    { key: "lift", name: "Workout" },
    { key: "content", name: "Content Creation" },
    { key: "730_alarm", name: "7:30 Alarm" },
    { key: "1045_bed", name: "10:45 Bedtime" },
    { key: "Test", name: "Test Habit" },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{formatDate(review.date)}</CardTitle>
      </CardHeader>
      <CardContent>
        {review.highlights && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-1">Highlights</h4>
            <p className="text-sm text-muted-foreground">{review.highlights}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          {habits.map((habit) => (
            <div key={habit.key} className="flex items-center space-x-2">
              {review[habit.key as keyof DailyReview] === true ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">{habit.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

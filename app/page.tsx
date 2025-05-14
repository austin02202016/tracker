"use client"

import { useState, useEffect } from "react"
import type { DailyReview } from "@/lib/supabase"
import { HabitHeatmap } from "@/components/habit-heatmap"
import { OverallHeatmap } from "@/components/overall-heatmap"
import { DayDetailsModal } from "@/components/day-details-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockReviews } from "@/lib/mock-data"
import { formatDate } from "@/lib/metrics"
import { Calendar, ChevronRight } from "lucide-react"

export default function Dashboard() {
  const [reviews, setReviews] = useState<DailyReview[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReview, setSelectedReview] = useState<DailyReview | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    // Simulate loading delay for demo
    const timer = setTimeout(() => {
      setReviews(mockReviews)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleCardClick = (review: DailyReview) => {
    setSelectedReview(review)
    setModalOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your daily reviews...</p>
        </div>
      </div>
    )
  }

  // Filter reviews that have highlights or transcripts
  const reviewsWithContent = reviews.filter((review) => review.highlights || review.transcript)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-extrabold mb-16 text-center tracking-tight">Daily Reviews Dashboard</h1>

        {/* Overall Activity Heatmap */}
        <section className="mb-24">
          <h2 className="text-2xl font-bold mb-6 tracking-tight">Overall Activity</h2>
          <OverallHeatmap reviews={reviews} />
        </section>

        {/* Individual Habit Heatmaps - Stacked vertically */}
        <section className="mb-24">
          <h2 className="text-2xl font-bold mb-6 tracking-tight">Habit Tracking</h2>
          <div className="space-y-12">
            <HabitHeatmap
              title="Workout"
              reviews={reviews}
              habitKey="lift"
              description="Track your workout consistency"
            />
            <HabitHeatmap
              title="Content Creation"
              reviews={reviews}
              habitKey="content"
              description="Track your content creation consistency"
            />
            <HabitHeatmap
              title="7:30 Alarm"
              reviews={reviews}
              habitKey="730_alarm"
              description="Track your early rising consistency"
            />
            <HabitHeatmap
              title="10:45 Bedtime"
              reviews={reviews}
              habitKey="1045_bed"
              description="Track your bedtime consistency"
            />
          </div>
        </section>

        {/* Daily Reviews Section */}
        <section className="mb-24">
          <h2 className="text-2xl font-bold mb-6 tracking-tight">Daily Reviews</h2>
          <div className="space-y-6">
            {reviewsWithContent.slice(0, 6).map((review) => (
              <Card
                key={review.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => handleCardClick(review)}
              >
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                    <CardTitle className="text-lg font-semibold">{formatDate(review.date)}</CardTitle>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {review.highlights ? (
                    <p className="text-base">{review.highlights}</p>
                  ) : review.transcript ? (
                    <p className="text-base text-muted-foreground">View transcript...</p>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Day Details Modal */}
        <DayDetailsModal review={selectedReview} open={modalOpen} onOpenChange={setModalOpen} />
      </div>
    </div>
  )
}

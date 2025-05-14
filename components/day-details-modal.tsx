"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, XCircle } from "lucide-react"
import type { DailyReview } from "@/lib/supabase"

interface DayDetailsModalProps {
  review: DailyReview | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DayDetailsModal({ review, open, onOpenChange }: DayDetailsModalProps) {
  if (!review) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const habits = [
    { key: "lift", name: "Workout" },
    { key: "content", name: "Content Creation" },
    { key: "730_alarm", name: "7:30 Alarm" },
    { key: "1045_bed", name: "10:45 Bedtime" },
    { key: "Test", name: "Test Habit" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">{formatDate(review.date)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {/* Habits Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 tracking-tight">Habits</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {habits.map((habit) => (
                <div key={habit.key} className="flex items-center p-4 rounded-md border bg-card">
                  {review[habit.key as keyof DailyReview] === true ? (
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
                  )}
                  <span className="text-lg font-medium">{habit.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights Section */}
          {review.highlights && (
            <div>
              <h3 className="text-xl font-bold mb-4 tracking-tight">Highlights</h3>
              <div className="p-5 rounded-md border bg-card">
                <p className="whitespace-pre-line text-lg">{review.highlights}</p>
              </div>
            </div>
          )}

          {/* Transcript Section */}
          {review.transcript && (
            <div>
              <h3 className="text-xl font-bold mb-4 tracking-tight">Transcript</h3>
              <div className="p-5 rounded-md border bg-card max-h-[300px] overflow-y-auto">
                <p className="whitespace-pre-line text-base">{review.transcript}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

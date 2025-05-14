import type { Streak } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Flame } from "lucide-react"

interface StreakCardProps {
  streak: Streak
}

export function StreakCard({ streak }: StreakCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{streak.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="text-2xl font-bold">{streak.current}</span>
            <span className="text-muted-foreground">days</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span>{streak.longest}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

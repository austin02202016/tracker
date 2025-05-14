import type { ConsistencyMetric } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ConsistencyCardProps {
  metric: ConsistencyMetric
}

export function ConsistencyCard({ metric }: ConsistencyCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold">{metric.percentage}%</span>
          <div>
            {metric.trend === "up" && (
              <div className="flex items-center text-green-500">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-xs">Improving</span>
              </div>
            )}
            {metric.trend === "down" && (
              <div className="flex items-center text-red-500">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                <span className="text-xs">Declining</span>
              </div>
            )}
            {metric.trend === "neutral" && (
              <div className="flex items-center text-gray-500">
                <Minus className="h-4 w-4 mr-1" />
                <span className="text-xs">Stable</span>
              </div>
            )}
          </div>
        </div>
        <Progress value={metric.percentage} className="h-2" />
      </CardContent>
    </Card>
  )
}

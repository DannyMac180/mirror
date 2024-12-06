import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function ProgressOverview() {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Progress Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span>Journaling Streak</span>
            <span>7 days</span>
          </div>
          <Progress value={70} />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span>Goals Completed</span>
            <span>3/5</span>
          </div>
          <Progress value={60} />
        </div>
      </CardContent>
    </Card>
  )
}


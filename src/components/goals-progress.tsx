import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function GoalsProgress() {
  const goals = [
    { name: 'Read 12 books', progress: 50 },
    { name: 'Exercise 3x/week', progress: 75 },
    { name: 'Learn a new skill', progress: 30 },
  ]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Goals Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <span>{goal.name}</span>
              <span>{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}


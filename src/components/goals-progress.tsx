import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function GoalsProgress() {
  const goals = [
    { name: 'Read 12 books', progress: 50 },
    { name: 'Exercise 3x/week', progress: 75 },
    { name: 'Learn a new skill', progress: 30 },
  ]

  return (
    <Card className="card-gradient border-none rounded-none">
      <CardHeader>
        <CardTitle className="font-mono tracking-wider text-sm">GOALS PROGRESS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {goals.map((goal, index) => (
          <div key={index}>
            <div className="flex justify-between mb-2">
              <span className="text-sm">{goal.name}</span>
              <span className="font-mono text-xs">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="rounded-none" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}


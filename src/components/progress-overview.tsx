import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function ProgressOverview() {
  return (
    <Card className="card-gradient border-none rounded-none">
      <CardHeader>
        <CardTitle className="font-mono tracking-wider text-sm">PROGRESS OVERVIEW</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between mb-2 font-mono text-xs">
            <span>JOURNALING STREAK</span>
            <span>7 DAYS</span>
          </div>
          <Progress value={70} className="rounded-none" />
        </div>
        <div>
          <div className="flex justify-between mb-2 font-mono text-xs">
            <span>GOALS COMPLETED</span>
            <span>3/5</span>
          </div>
          <Progress value={60} className="rounded-none" />
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          <div>OUTPUT 45</div>
          <div>SEED: 2226809351</div>
        </div>
      </CardContent>
    </Card>
  )
}


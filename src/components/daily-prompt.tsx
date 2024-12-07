import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function DailyPrompt() {
  return (
    <Card className="card-gradient border-none rounded-none hover-lift hover-darken">
      <CardHeader>
        <CardTitle className="font-mono tracking-wider text-sm">DAILY PROMPT</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm">What's one thing you're grateful for today?</p>
          <div className="font-mono text-xs text-muted-foreground">
            <div>OUTPUT 23</div>
            <div>SEED: 3573860127</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


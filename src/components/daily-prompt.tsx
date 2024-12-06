import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function DailyPrompt() {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Daily Reflection Prompt</CardTitle>
      </CardHeader>
      <CardContent>
        <p>What's one thing you're grateful for today?</p>
      </CardContent>
    </Card>
  )
}


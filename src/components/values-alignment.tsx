import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function ValuesAlignment() {
  const values = [
    { name: 'Honesty', score: 9 },
    { name: 'Growth', score: 8 },
    { name: 'Compassion', score: 7 },
  ]

  return (
    <Card className="card-gradient border-none rounded-none">
      <CardHeader>
        <CardTitle className="font-mono tracking-wider text-sm">VALUES ALIGNMENT</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {values.map((value, index) => (
            <li key={index} className="flex justify-between">
              <span className="text-sm">{value.name}</span>
              <span className="font-mono text-xs">{value.score}/10</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}


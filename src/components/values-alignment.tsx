import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function ValuesAlignment() {
  const values = [
    { name: 'Honesty', score: 9 },
    { name: 'Growth', score: 8 },
    { name: 'Compassion', score: 7 },
  ]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Values Alignment</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {values.map((value, index) => (
            <li key={index} className="flex justify-between">
              <span>{value.name}</span>
              <span className="font-semibold">{value.score}/10</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}


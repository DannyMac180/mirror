import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function RecentEntries() {
  const entries = [
    { date: '2023-06-01', title: 'Reflecting on personal growth' },
    { date: '2023-05-30', title: 'Overcoming challenges' },
    { date: '2023-05-28', title: 'Gratitude and mindfulness' },
  ]

  return (
    <Card className="card-gradient border-none rounded-none hover-lift hover-darken">
      <CardHeader>
        <CardTitle className="font-mono tracking-wider text-sm">RECENT ENTRIES</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {entries.map((entry, index) => (
            <li key={index} className="flex justify-between">
              <span className="text-sm">{entry.title}</span>
              <span className="font-mono text-xs text-muted-foreground">{entry.date}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}


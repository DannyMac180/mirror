import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function RecentEntries() {
  const entries = [
    { date: '2023-06-01', title: 'Reflecting on personal growth' },
    { date: '2023-05-30', title: 'Overcoming challenges' },
    { date: '2023-05-28', title: 'Gratitude and mindfulness' },
  ]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Recent Journal Entries</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {entries.map((entry, index) => (
            <li key={index} className="flex justify-between">
              <span>{entry.title}</span>
              <span className="text-sm text-gray-500">{entry.date}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}


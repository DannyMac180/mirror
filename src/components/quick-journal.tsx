import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PenTool } from 'lucide-react'

export function QuickJournal() {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Quick Journal</CardTitle>
      </CardHeader>
      <CardContent>
        <Button className="w-full">
          <PenTool className="mr-2 h-4 w-4" /> Start Writing
        </Button>
      </CardContent>
    </Card>
  )
}


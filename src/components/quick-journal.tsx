import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PenTool } from 'lucide-react'

export function QuickJournal() {
  return (
    <Card className="card-gradient border-none rounded-none hover-lift hover-darken">
      <CardHeader>
        <CardTitle className="font-mono tracking-wider text-sm">NEW ENTRY</CardTitle>
      </CardHeader>
      <CardContent>
        <Button className="w-full rounded-none font-mono text-xs tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors duration-300" variant="outline">
          <PenTool className="mr-2 h-4 w-4" /> START WRITING
        </Button>
      </CardContent>
    </Card>
  )
}


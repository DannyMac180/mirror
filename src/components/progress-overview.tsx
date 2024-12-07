"use client"

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function ProgressOverview() {
  const [journalingProgress, setJournalingProgress] = useState(0)
  const [goalsProgress, setGoalsProgress] = useState(0)

  useEffect(() => {
    const journalingTimer = setTimeout(() => setJournalingProgress(70), 100)
    const goalsTimer = setTimeout(() => setGoalsProgress(60), 100)

    return () => {
      clearTimeout(journalingTimer)
      clearTimeout(goalsTimer)
    }
  }, [])

  return (
    <Card className="card-gradient border-none rounded-none hover-lift hover-darken">
      <CardHeader>
        <CardTitle className="font-mono tracking-wider text-sm">PROGRESS OVERVIEW</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between mb-2 font-mono text-xs">
            <span>JOURNALING STREAK</span>
            <span>7 DAYS</span>
          </div>
          <Progress value={journalingProgress} className="rounded-none transition-all duration-1000 ease-out" />
        </div>
        <div>
          <div className="flex justify-between mb-2 font-mono text-xs">
            <span>GOALS COMPLETED</span>
            <span>3/5</span>
          </div>
          <Progress value={goalsProgress} className="rounded-none transition-all duration-1000 ease-out" />
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          <div>OUTPUT 45</div>
          <div>SEED: 2226809351</div>
        </div>
      </CardContent>
    </Card>
  )
}


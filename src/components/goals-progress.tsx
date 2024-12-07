"use client"

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function GoalsProgress() {
  const goals = [
    { name: 'Read 12 books', targetProgress: 50 },
    { name: 'Exercise 3x/week', targetProgress: 75 },
    { name: 'Learn a new skill', targetProgress: 30 },
  ]

  const [progress, setProgress] = useState(goals.map(() => 0))

  useEffect(() => {
    const timers = goals.map((goal, index) => 
      setTimeout(() => setProgress(prev => {
        const newProgress = [...prev]
        newProgress[index] = goal.targetProgress
        return newProgress
      }), 100 * (index + 1))
    )

    return () => timers.forEach(timer => clearTimeout(timer))
  }, [])

  return (
    <Card className="card-gradient border-none rounded-none hover-lift hover-darken">
      <CardHeader>
        <CardTitle className="font-mono tracking-wider text-sm">GOALS PROGRESS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {goals.map((goal, index) => (
          <div key={index}>
            <div className="flex justify-between mb-2">
              <span className="text-sm">{goal.name}</span>
              <span className="font-mono text-xs">{progress[index]}%</span>
            </div>
            <Progress 
              value={progress[index]} 
              className="rounded-none transition-all duration-1000 ease-out" 
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}


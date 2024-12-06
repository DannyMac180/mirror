import { DailyPrompt } from './components/daily-prompt'
import { QuickJournal } from './components/quick-journal'
import { ProgressOverview } from './components/progress-overview'
import { RecentEntries } from './components/recent-entries'
import { GoalsProgress } from './components/goals-progress'
import { ValuesAlignment } from './components/values-alignment'

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1 space-y-6">
        <DailyPrompt />
        <QuickJournal />
      </div>
      <div className="md:col-span-2 space-y-6">
        <ProgressOverview />
        <RecentEntries />
      </div>
      <div className="md:col-span-1 space-y-6">
        <GoalsProgress />
        <ValuesAlignment />
      </div>
    </div>
  )
}


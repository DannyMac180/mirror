import { DailyPrompt } from './components/daily-prompt'
import { QuickJournal } from './components/quick-journal'
import { ProgressOverview } from './components/progress-overview'
import { RecentEntries } from './components/recent-entries'
import { GoalsProgress } from './components/goals-progress'
import { ValuesAlignment } from './components/values-alignment'

export default function Dashboard() {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-8">
          <DailyPrompt />
          <QuickJournal />
        </div>
        <div className="md:col-span-2 space-y-8">
          <ProgressOverview />
          <RecentEntries />
        </div>
        <div className="md:col-span-1 space-y-8">
          <GoalsProgress />
          <ValuesAlignment />
        </div>
      </div>
      <hr className="separator" />
    </div>
  )
}


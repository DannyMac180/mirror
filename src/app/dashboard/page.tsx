import { DailyPrompt } from '@/components/daily-prompt'
import { QuickJournal } from '@/components/quick-journal'
import { ProgressOverview } from '@/components/progress-overview'
import { RecentEntries } from '@/components/recent-entries'
import { GoalsProgress } from '@/components/goals-progress'
import { ValuesAlignment } from '@/components/values-alignment'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      {/* Header Section */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Your Mirror Dashboard</h1>
        <p className="text-gray-600">Track what matters most, in a layout that suits you.</p>
      </header>

      {/* Main Content: Vertical Stack of Cards */}
      <div className="flex flex-col space-y-6">
        <div className="bg-gray-50 rounded-md shadow-sm p-4 hover:shadow-md transition-shadow">
          <DailyPrompt />
        </div>

        <div className="bg-gray-50 rounded-md shadow-sm p-4 hover:shadow-md transition-shadow">
          <QuickJournal />
        </div>

        <div className="bg-gray-50 rounded-md shadow-sm p-4 hover:shadow-md transition-shadow">
          <ProgressOverview />
        </div>

        <div className="bg-gray-50 rounded-md shadow-sm p-4 hover:shadow-md transition-shadow">
          <RecentEntries />
        </div>

        <div className="bg-gray-50 rounded-md shadow-sm p-4 hover:shadow-md transition-shadow">
          <GoalsProgress />
        </div>

        <div className="bg-gray-50 rounded-md shadow-sm p-4 hover:shadow-md transition-shadow">
          <ValuesAlignment />
        </div>
      </div>
    </div>
  )
}
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-semibold mb-8">Welcome to Mirror</h1>
        
        {/* Placeholder content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats Card */}
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-2">Your Stats</h2>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
          
          {/* Activity Card */}
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-2">Recent Activity</h2>
            <p className="text-muted-foreground">No recent activity</p>
          </div>
          
          {/* Settings Card */}
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-2">Quick Settings</h2>
            <p className="text-muted-foreground">Settings will appear here</p>
          </div>
        </div>
      </div>
    </div>
  )
}

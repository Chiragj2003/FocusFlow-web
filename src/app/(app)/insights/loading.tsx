export default function InsightsLoading() {
  return (
    <div className="space-y-4 sm:space-y-6 pt-14 lg:pt-0 animate-pulse">
      {/* Header Skeleton */}
      <div>
        <div className="h-7 bg-zinc-800 rounded-lg w-28 mb-2" />
        <div className="h-4 bg-zinc-800/50 rounded w-48" />
      </div>

      {/* Quick Stats Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-zinc-900/50 rounded-xl border border-zinc-800/50 p-3 sm:p-4">
            <div className="h-3 bg-zinc-800/50 rounded w-20 mb-2" />
            <div className="h-7 bg-zinc-800 rounded w-16" />
          </div>
        ))}
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-800/50 p-4 sm:p-6 h-72" />
        <div className="bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-800/50 p-4 sm:p-6 h-72" />
      </div>

      {/* Heatmap Skeleton */}
      <div className="bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-800/50 p-4 sm:p-6 h-48" />

      {/* Bottom Grid Skeleton */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-800/50 p-4 sm:p-6 h-64" />
        <div className="bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-800/50 p-4 sm:p-6 h-64" />
      </div>
    </div>
  )
}

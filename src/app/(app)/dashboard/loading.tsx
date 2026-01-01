export default function DashboardLoading() {
  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 pt-14 lg:pt-0 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <div className="h-8 bg-zinc-800 rounded-lg w-64 mb-2" />
          <div className="h-4 bg-zinc-800/50 rounded w-48" />
        </div>
        <div className="h-10 bg-zinc-800 rounded-xl w-32" />
      </div>

      {/* Quote Skeleton */}
      <div className="bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-800/50 p-4 sm:p-6 h-32" />

      {/* Progress Card Skeleton */}
      <div className="bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-800/50 p-4 sm:p-6">
        <div className="h-6 bg-zinc-800 rounded w-40 mb-4" />
        <div className="h-3 bg-zinc-800 rounded-full w-full mb-2" />
        <div className="h-4 bg-zinc-800/50 rounded w-32" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-800/50 p-3 sm:p-6">
            <div className="h-4 bg-zinc-800/50 rounded w-20 mb-2" />
            <div className="h-8 bg-zinc-800 rounded w-16 mb-1" />
            <div className="h-3 bg-zinc-800/50 rounded w-24" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-800/50 p-4 sm:p-6 h-64" />
          <div className="bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-800/50 p-4 sm:p-6 h-56" />
        </div>
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-800/50 p-4 sm:p-6 h-48" />
          <div className="bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-800/50 p-4 sm:p-6 h-48" />
        </div>
      </div>
    </div>
  )
}

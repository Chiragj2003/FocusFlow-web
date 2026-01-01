export default function HabitsLoading() {
  return (
    <div className="space-y-4 sm:space-y-6 pt-14 lg:pt-0 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div>
          <div className="h-7 bg-zinc-800 rounded-lg w-32 mb-2" />
          <div className="h-4 bg-zinc-800/50 rounded w-64" />
        </div>
        <div className="h-10 bg-zinc-800 rounded-xl w-48" />
      </div>

      {/* Toolbar Skeleton */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-9 bg-zinc-800/50 rounded-lg w-24" />
        ))}
      </div>

      {/* Habit Grid Skeleton */}
      <div className="bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-800/50 overflow-hidden">
        {/* Header */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-zinc-800/50 flex items-center justify-between">
          <div className="h-6 bg-zinc-800 rounded w-32" />
          <div className="h-9 bg-zinc-800 rounded-xl w-28" />
        </div>
        
        {/* Grid Content */}
        <div className="p-4">
          {/* Day Headers */}
          <div className="flex gap-1 mb-4 pl-44">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="w-6 h-8 bg-zinc-800/30 rounded" />
            ))}
          </div>
          
          {/* Habit Rows */}
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="flex items-center gap-2 mb-3">
              <div className="w-44 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="h-4 bg-zinc-800/50 rounded w-24" />
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="w-6 h-6 bg-zinc-800/30 rounded-md" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

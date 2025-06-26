import { Skeleton } from "@/components/ui/skeleton"

export function QuotesSkeleton() {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24 mt-1" />
          </div>
        </div>
        <Skeleton className="h-6 w-24" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-start gap-2">
          <Skeleton className="h-4 w-4 mt-0.5" />
          <div className="w-full">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-24 mt-1" />
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Skeleton className="h-4 w-4 mt-0.5" />
          <div className="w-full">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-full mt-1" />
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Skeleton className="h-4 w-4 mt-0.5" />
          <div className="w-full">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-20 mt-1" />
          </div>
        </div>
      </div>

      <Skeleton className="h-10 w-full" />
    </div>
  )
}

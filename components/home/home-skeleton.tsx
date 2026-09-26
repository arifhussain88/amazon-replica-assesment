import { Skeleton } from "@/components/ui/skeleton";

export function HomeSkeleton() {
  return (
    <div className="space-y-12" role="status" aria-live="polite" aria-label="Loading the catalogue">
      <div className="space-y-3">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-10 w-full max-w-xl" />
        <Skeleton className="h-4 w-full max-w-lg" />
        <div className="flex flex-wrap gap-2 pt-2">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-8 w-28" />
          ))}
        </div>
      </div>
      <div>
        <Skeleton className="mb-4 h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-80 sm:col-span-2 lg:row-span-2" />
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-64" />
          ))}
        </div>
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export function HomeSkeleton() {
  return (
    <div className="space-y-12" role="status" aria-live="polite" aria-label="Loading the catalogue">
      <div className="-mx-3 bg-primary/10 px-3 py-12 lg:-mx-6 lg:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-full max-w-md" />
            <Skeleton className="h-4 w-full max-w-sm" />
            <Skeleton className="mt-4 h-12 w-44" />
          </div>
          <Skeleton className="aspect-[4/5] w-full sm:aspect-[5/4]" />
        </div>
      </div>
      <div>
        <Skeleton className="mb-4 h-8 w-48" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 9 }, (_, index) => (
            <Skeleton key={index} className="h-24 w-32 shrink-0" />
          ))}
        </div>
      </div>
      <div>
        <Skeleton className="mb-4 h-8 w-32" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="min-h-[28rem] sm:col-span-2 lg:row-span-2" />
          <Skeleton className="min-h-56" />
          <Skeleton className="min-h-56" />
          <Skeleton className="min-h-56 sm:col-span-2 lg:col-span-1" />
        </div>
      </div>
    </div>
  );
}

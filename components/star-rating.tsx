import { Star } from "lucide-react";

export function StarRating({ ratingTimes10, count }: { ratingTimes10: number; count?: number }) {
  const rating = ratingTimes10 / 10;
  return (
    <div className="flex min-h-5 items-center gap-1 text-sm">
      <span className="flex" aria-hidden>
        {Array.from({ length: 5 }, (_, index) => {
          const fill = Math.min(1, Math.max(0, rating - index));
          return (
            <span key={index} className="relative size-4">
              <Star className="size-4 text-accent" />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className="size-4 fill-accent text-accent" />
              </span>
            </span>
          );
        })}
      </span>
      <span className="sr-only">{rating.toFixed(1)} out of 5 stars</span>
      {count != null ? <span className="text-primary">{count.toLocaleString()}</span> : null}
    </div>
  );
}

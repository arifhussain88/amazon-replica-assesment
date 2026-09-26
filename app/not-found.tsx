import Link from "next/link";
import { cardSurface } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className={cn(cardSurface, "p-8")}>
      <h1 className="text-2xl font-semibold">We could not find that page</h1>
      <Link href="/" className="mt-3 inline-block text-primary">
        Back to Northline
      </Link>
    </div>
  );
}

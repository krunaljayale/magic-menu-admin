// components/Cards/RiderDetailCardSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function RiderDetailCardSkeleton() {
  return (
    <div className="grid rounded-[10px] bg-white p-6 text-dark shadow-1 dark:bg-gray-dark dark:text-white">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-24" /> {/* Label */}
            <Skeleton className="h-5 w-32" /> {/* Value */}
          </div>
        ))}
      </div>

      {/* Button placeholder */}
      <div className="mt-10 flex justify-end">
        <Skeleton className="h-10 w-40 rounded" />
      </div>
    </div>
  );
}

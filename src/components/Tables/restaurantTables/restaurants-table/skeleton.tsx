import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RestaurantTableSkeleton() {
  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h2 className="px-4 py-6 text-2xl font-bold text-dark dark:text-white md:px-6 xl:px-9">
         Total Registered Restaurants
      </h2>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="min-w-[160px] !text-left">
              Hotel Logo
            </TableHead>
            <TableHead className="!text-left">Hotel Name</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Today's Orders</TableHead>
            <TableHead>Weekly Sales (₹)</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell colSpan={100}>
                <Skeleton className="h-8" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

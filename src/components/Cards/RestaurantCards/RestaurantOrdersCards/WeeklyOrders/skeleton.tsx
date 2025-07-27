import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function WeeklyOrdersSkeleton() {
  return (
    <div className="mt-15 rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead className="pl-6">Order Id #</TableHead>
            
            <TableHead>Ordered At</TableHead>
            <TableHead>Order Value (₹)</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Payment Status</TableHead>
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

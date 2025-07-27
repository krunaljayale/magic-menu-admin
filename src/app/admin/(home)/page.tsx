import { PaymentsOverview } from "@/components/Charts/payments-overview";
import { UsedDevices } from "@/components/Charts/used-devices";
import { WeeksProfit } from "@/components/Charts/weeks-profit";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { Suspense } from "react";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { RegionLabels } from "./_components/region-labels";
import { ChatsCard } from "./_components/chats-card";
import { RidersTableSkeleton } from "@/components/Tables/riderTables/riders-table/skeleton";
import { RidersTable } from "@/components/Tables/riderTables/riders-table";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default async function Home({ searchParams }: PropsType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);

  return (
    <>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup />
      </Suspense>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <PaymentsOverview
          className="col-span-12 xl:col-span-7"
          key={extractTimeFrame("payments_overview")}
          timeFrame={extractTimeFrame("payments_overview")?.split(":")[1]}
        />

        <WeeksProfit
          key={extractTimeFrame("weeks_profit")}
          timeFrame={extractTimeFrame("weeks_profit")?.split(":")[1]}
          className="col-span-12 xl:col-span-5"
        />

        {/* <UsedDevices
          className="col-span-12 xl:col-span-5"
          key={extractTimeFrame("used_devices")}
          timeFrame={extractTimeFrame("used_devices")?.split(":")[1]}
        /> */}

        {/* <RegionLabels /> */}

        <div className="col-span-12 grid xl:col-span-8">
          <Suspense fallback={<RidersTableSkeleton />}>
            <RidersTable actionable={false} />
          </Suspense>
        </div>

        {/* <Suspense fallback={null}>
          <ChatsCard />
        </Suspense> */}
      </div>
    </>
  );
}

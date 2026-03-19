import type { Metadata } from "next";
import { ReportDetail } from "./report-detail";

export const metadata: Metadata = {
  title: "Observation Detail",
  description: "Detailed view of a citizen observation report.",
};

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <ReportDetail id={id} />
    </div>
  );
}

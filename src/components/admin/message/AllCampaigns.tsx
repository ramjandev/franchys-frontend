import DashboardTopSection from "@/components/shared/DashboardTopSection";
import LoadingStatus from "@/components/shared/loading/LoadingStatus";
import StatusBadge from "@/components/shared/StatusBadge";
import { useGetCampaignsQuery } from "@/store/campaign/campaignAPI";
import { Link, useNavigate } from "react-router-dom";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const AllCampaigns = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useGetCampaignsQuery();

  const campaignData = data?.data ?? [];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="">
        <DashboardTopSection
          title=" All Campaigns"
          backButton
          buttonOne="New Campaign"
          actionOne={() => navigate("../campaign-create")}
        />
        <LoadingStatus
          isLoading={isLoading}
          items={campaignData}
          itemName="campaigns"
        />

        {!isLoading && campaignData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-col gap-3">
              {!isLoading && campaignData.length === 0 && (
                <p className="text-sm text-slate-400 px-4 py-6 text-center">
                  No campaigns found.
                </p>
              )}
              {campaignData.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg shrink-0">
                    🏷️
                  </div>

                  {/* Title + desc */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {c.title}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {c.targetAudience}
                    </p>
                  </div>

                  {/* Type */}
                  <div className="w-28 shrink-0">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                      Type
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {c.type}
                    </p>
                  </div>

                  {/* Recipients */}
                  <div className="w-24 shrink-0">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                      Recipients
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        c.recipientsCount ? "text-blue-500" : "text-slate-400"
                      }`}
                    >
                      {c.recipientsCount
                        ? c.recipientsCount.toLocaleString()
                        : "–"}
                    </p>
                  </div>

                  {/* Created */}
                  <div className="w-28 shrink-0">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                      Created
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {formatDate(c.createdAt)}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="w-20 shrink-0 flex justify-center">
                    <StatusBadge status={c.status} />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link to={`../campaigns/${c.id}`}>
                      <button className="px-4 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold border-none cursor-pointer transition-colors">
                        View
                      </button>
                    </Link>
                    <Link to={`../campaign-create/${c.id}`}>
                      <button className="px-4 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold cursor-pointer transition-colors">
                        Edit
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AllCampaigns;

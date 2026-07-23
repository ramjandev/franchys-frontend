import DashboardTopSection from "@/components/shared/DashboardTopSection";
import StatusBadge from "@/components/shared/StatusBadge";
import { inputClass } from "@/pages/Login";
import { useGetCampaignByIdQuery } from "@/store/campaign/campaignAPI";
import { useNavigate, useParams } from "react-router-dom";

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data } = useGetCampaignByIdQuery(id!, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });
  const campaign = data?.data;

  if (!campaign) return null;

  return (
    <div className="flex-1 ">
      <div className="">
        <DashboardTopSection
          title="Back to Campaigns"
          backButton
          buttonOne="Edit Campaign"
          actionOne={() => navigate(`../campaign-create/${campaign.id}`)}
        />

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Title row */}
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-extrabold text-slate-800 m-0">
              {campaign.title}
            </h1>
            <StatusBadge status={campaign.status} />
          </div>
          <p className="text-sm text-slate-400 mb-6">{campaign.type}</p>

          {/* Email subject */}
          <div className="mb-5">
            <p className={inputClass.label}>Email Subject</p>
            <p className="text-sm text-slate-700">{campaign.title}</p>
          </div>

          {/* Message content */}
          <div className="mb-6">
            <p className={inputClass.label}>Message Content</p>
            <div className="rounded-xl border-2 border-blue-300 bg-blue-50/30 p-5">
              {campaign.termsCondition.split("\n").map((line, i) => (
                <p
                  key={i}
                  className={`text-sm text-slate-700 m-0 ${line === "" ? "mt-3" : ""}`}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          {campaign.featuredProducts.length > 0 && (
            <div>
              <p className={inputClass.label}>
                Featured Products ({campaign.featuredProducts.length})
              </p>
              <div className="grid grid-cols-2 gap-3">
                {campaign.featuredProducts.map((productId) => (
                  <div
                    key={productId}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <span className="text-3xl">🏷️</span>
                    <p className="text-sm font-semibold text-slate-800 mt-2 mb-0">
                      {productId}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">—</p>
                    <p className="text-sm font-bold text-blue-500 mt-1">—</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;

import CommonHeader from "@/components/shared/CommonHeader";

const mockActivity = [
  {
    id: 1,
    text: "Quote Q-1004 approved by Craft Brewery Co",
    date: "9/8/2025",
  },
  { id: 2, text: "Quote Q-1005 sent to Summit CrossFit", date: "9/20/2025" },
  { id: 3, text: "Job J-2002 created for Summit CrossFit", date: "9/20/2025" },
  { id: 4, text: "Payment of $8,100 received for INV-3001", date: "8/20/2025" },
  { id: 5, text: "Job J-2001 moved to In Production", date: "8/22/2025" },
  { id: 6, text: "New customer Golden State Realty added", date: "8/7/2025" },
];
const RecentActivity = () => {
  return (
    <div className=" h-full flex flex-col">
      <div className="border-b-[1.173px] border-border  p-6  bg-linear-to-r from-[#F8FAFC] to-white rounded-t-3xl">
        <CommonHeader size="lg" className="">
          Recent Activity
        </CommonHeader>
      </div>

      <div className="relative flex flex-col justify-between gap-5  rounded-b-3xl border-b-[1.173px] border-border bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)] p-6 flex-1 ">
        {/* vertical line */}
        <div className="absolute left-7 top-8 bottom-13 w-0.5 bg-slate-200" />

        {mockActivity.map((activity) => (
          <div key={activity.id} className="flex gap-4 relative ">
            {/* dot */}
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#2B7FFF] to-[#1447E6] mt-1 shrink-0 z-10" />

            {/* content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700">{activity.text}</p>
              <p className="text-xs text-slate-500 mt-1">{activity.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;

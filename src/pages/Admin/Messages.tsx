import EmptyDetail from "@/components/admin/message/EmptyDetail";
import { type Tab } from "@/components/admin/message/MessageData";
import MessageDetail from "@/components/admin/message/MessageDetail";
import MessageList from "@/components/admin/message/MessageList";
import MessageTab from "@/components/admin/message/MessageTab";
import CommonButton from "@/components/shared/CommonButton";
import DashboardTopSection from "@/components/shared/DashboardTopSection";

import {
  useGetEmailThreadsQuery,
  useLazyStartWatchQuery,
} from "@/store/messages/emailTrackerAPI";
import { RefreshCw } from "lucide-react";
import React, { useState } from "react";
import { MdOutlineCampaign } from "react-icons/md";

const Messages: React.FC = () => {
  const [tab, setTab] = useState<Tab>("Email");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useGetEmailThreadsQuery();
  const [triggerStartWatch, { isFetching: isSyncing }] =
    useLazyStartWatchQuery();

  const threads = data?.data ?? [];

  const handleSync = async () => {
    try {
      await triggerStartWatch().unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to start email watch", err);
    }
  };

  console.log("selectedThreadId", selectedThreadId);
  return (
    <div className="flex flex-col ">
      <div className=" flex items-center justify-between gap-6">
        <DashboardTopSection
          title="Messaging"
          description="Create and manage messages and campaigns."
          backButton
        />

        <div className="flex items-center gap-3">
          <CommonButton onClick={handleSync} variant="secondary">
            <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
            {isSyncing ? "Syncing..." : "Sync Inbox"}
          </CommonButton>

          <CommonButton variant="primaryBlue" to="../campaigns">
            <MdOutlineCampaign className="text-lg" />
            Marketing Campaigns
          </CommonButton>
        </div>
      </div>

      <header className="flex items-center gap-3shrink-0 pb-6">
        <MessageTab tab={tab} setTab={setTab} />

        <div className="flex-1" />
      </header>

      <main className="flex flex-1 min-h-0 gap-3 pb-4">
        <div className="w-[340px] bg-white rounded-2xl shadow-sm overflow-y-auto">
          <MessageList
            threads={threads}
            isLoading={isLoading}
            selectedThreadId={selectedThreadId}
            onSelect={setSelectedThreadId}
          />
        </div>
        <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-y-auto">
          {selectedThreadId ? (
            <MessageDetail threadId={selectedThreadId} />
          ) : (
            <EmptyDetail />
          )}
        </div>
      </main>
    </div>
  );
};

export default Messages;

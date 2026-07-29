import EmptyDetail from "@/components/admin/message/EmptyDetail";
import { useGetWhatsAppConversationsQuery } from "@/store/whatApp/whatsappTrackerAPI";
import { useState } from "react";
import ConversationDetail from "./ConversationDetail";
import ConversationList from "./ConversationList";

const WhatAppTracker: React.FC = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  const { data, isLoading } = useGetWhatsAppConversationsQuery();
  const conversations = data?.data ?? [];

  return (
    <main className="flex flex-1 items-start min-h-0 gap-3 pb-4">
      <div className="w-[340px] bg-white rounded-2xl shadow-sm overflow-y-auto">
        <ConversationList
          conversations={conversations}
          isLoading={isLoading}
          selectedConversationId={selectedConversationId}
          onSelect={setSelectedConversationId}
        />
      </div>
      <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-y-auto">
        {selectedConversationId ? (
          <ConversationDetail conversationId={selectedConversationId} />
        ) : (
          <EmptyDetail />
        )}
      </div>
    </main>
  );
};

export default WhatAppTracker;

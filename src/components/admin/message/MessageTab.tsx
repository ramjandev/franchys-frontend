import type { Dispatch, SetStateAction } from "react";
import type { Tab } from "./MessageData";

interface MessageTabProps {
  tab: string;
  setTab: Dispatch<SetStateAction<Tab>>;
}
const MessageTab: React.FC<MessageTabProps> = ({ tab, setTab }) => {
  return (
    <div className="flex gap-2 ml-1">
      {(["Email", "WhatsApp"] as Tab[]).map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium cursor-pointer border transition-colors ${
            tab === t
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
        >
          {t === "Email" ? "✉️" : "💬"} {t}
        </button>
      ))}
    </div>
  );
};

export default MessageTab;

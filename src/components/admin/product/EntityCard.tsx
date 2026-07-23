import DeleteAlert from "@/components/shared/DeleteButton";
import EditButton from "@/components/shared/IconActionButton";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
interface EntityCardProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  createdAt: string;
  onEdit: () => void;
  onDelete: () => void;
}

const EntityCard: React.FC<EntityCardProps> = ({
  icon,
  name,
  description,
  createdAt,
  onEdit,
  onDelete,
}) => (
  <div className=" relative bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5  shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:shadow-xs transition-all">
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] text-[#155DFC] flex items-center justify-center text-xl shrink-0">
        {icon}
      </div>
      <div className="flex items-center gap-1  transition-opacity">
        <EditButton onClick={onEdit} title="Edit" />
        <DeleteAlert action={onDelete} />
      </div>
    </div>

    <p className="text-sm font-bold text-[#0F172B] truncate">{name}</p>
    <p className="text-xs text-[#62748E] mt-1 line-clamp-2 min-h-[32px]">
      {description}
    </p>

    <div className="mt-4 pt-3 border-t border-[#F1F5F9]">
      <p className="text-[11px] text-[#94A3B8]">
        Added {formatDate(createdAt)}
      </p>
    </div>
  </div>
);

export default EntityCard;

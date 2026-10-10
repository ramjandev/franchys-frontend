import EmptyState from "./EmptyState";
import TableLoading from "./TableLoading";

type ListStatusProps = {
  isLoading: boolean;
  items?: any[];
  itemName?: string;
};

const LoadingStatus: React.FC<ListStatusProps> = ({
  isLoading,
  items = [],
  itemName = "items",
}) => {
  if (isLoading) return <>{<TableLoading />}</>;
  if (!items.length) return <EmptyState title={`No ${itemName} found.`} />;

  return null;
};

export default LoadingStatus;

import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import { useSyncSanmarSftpMutation } from "@/store/sanmar/sanmarApi";

const SanMar = () => {
  const [syncSanmarSftp, { isLoading }] = useSyncSanmarSftpMutation();

  const handleSync = async () => {
    try {
      await syncSanmarSftp().unwrap();
    } catch (error) {
      console.error("Failed to sync SanMar database:", error);
    }
  };

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <CommonHeader size="2xl" className="font-medium!">
          SanMar Database
        </CommonHeader>

        <CommonHeader size="sm">
          Retrieve the latest data from the SanMar database.
        </CommonHeader>
      </div>

      <CommonButton
        variant="primaryGreen"
        onClick={handleSync}
        isLoading={isLoading}
        loadingText="Syncing..."
        disabled={isLoading}
      >
        Get Updated Data
      </CommonButton>
    </section>
  );
};

export default SanMar;


import { PageHeader } from "@/components/layout/PageHeader";

const SettingsPage = () => {
  return (
    <>
      <PageHeader title="Settings" />
      <div className="p-6">
        <div className="bg-white rounded-lg p-6 shadow mb-4">
          <h2 className="text-lg font-semibold mb-2">App Settings</h2>
          <div className="text-muted-foreground text-sm">
            {/* Add settings inputs here */}
            No settings available yet.
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;

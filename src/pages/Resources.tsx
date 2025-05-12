
import AppLayout from "@/components/layout/AppLayout";
import { ResourceLibrary } from "@/components/resources/ResourceLibrary";

const Resources = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Resource Library</h1>
          <p className="text-muted-foreground">Browse and manage your study resources</p>
        </div>
        
        <ResourceLibrary />
      </div>
    </AppLayout>
  );
};

export default Resources;

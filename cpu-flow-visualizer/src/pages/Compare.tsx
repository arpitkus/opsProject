
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers } from "lucide-react";

const Compare = () => {
  return (
    <>
      <AppSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Compare Algorithms</h1>
            <p className="text-muted-foreground mt-1">
              Compare multiple CPU scheduling algorithms side by side
            </p>
          </div>
          {/* Fixed: Removed asChild prop from SidebarTrigger */}
          <SidebarTrigger>
            <Button variant="outline" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </SidebarTrigger>
        </div>

        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <Layers className="h-16 w-16 text-vivid-purple/50" />
          <h2 className="text-2xl font-bold">Algorithm Comparison</h2>
          <p className="text-muted-foreground text-center max-w-md">
            This feature will allow you to compare multiple CPU scheduling algorithms side by side with the same input processes.
          </p>
          <Button>Coming Soon</Button>
        </div>
      </div>
    </>
  );
};

export default Compare;

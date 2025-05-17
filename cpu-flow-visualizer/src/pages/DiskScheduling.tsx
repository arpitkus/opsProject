
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, HardDrive, Construction } from "lucide-react";

const DiskScheduling = () => {
  return (
    <>
      <AppSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Disk Scheduling</h1>
            <p className="text-muted-foreground mt-1">
              Visualize disk scheduling algorithms like FCFS, SSTF, SCAN, C-SCAN and more
            </p>
          </div>
          <SidebarTrigger>
            <Button variant="outline" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </SidebarTrigger>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-6 bg-muted rounded-full p-6">
                <HardDrive className="h-16 w-16 text-muted-foreground" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Coming Soon</h2>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                We're working hard to bring disk scheduling visualization to you. 
                This feature will allow you to explore and understand various disk 
                scheduling algorithms.
              </p>
              <div className="flex items-center gap-2">
                <Construction className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium">Under Development</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DiskScheduling;

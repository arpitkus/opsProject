
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Cpu, HardDrive, Layers, Cog, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Log to help debug the SidebarTrigger issue
console.log("AppSidebar.tsx is loading");

export function AppSidebar() {
  const location = useLocation();

  const cpuSchedulingItems = [
    { name: "First Come First Serve (FCFS)", path: "/algorithm/fcfs" },
    { name: "Shortest Job First (SJF)", path: "/algorithm/sjf" },
    { name: "Round Robin (RR)", path: "/algorithm/rr" },
    { name: "Longest Job First (LJF)", path: "/algorithm/ljf" },
    { name: "Priority Scheduling", path: "/algorithm/priority" },
    { name: "Longest Remaining Time First (LRTF)", path: "/algorithm/lrtf" },
    { name: "Shortest Remaining Time First (SRTF)", path: "/algorithm/srtf" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col items-center justify-center py-4">
        <Link to="/" className="flex items-center space-x-2">
          <Cpu className="h-6 w-6 text-vivid-purple" />
          <span className="font-bold text-xl">CPU Scheduler</span>
        </Link>
        <div className="flex mt-4 w-full px-4">
          {/* Fixed: Removed asChild prop from SidebarTrigger */}
          <SidebarTrigger>
            <Button variant="outline" size="icon" className="ml-auto">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </SidebarTrigger>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/")}>
                  <Link to="/">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/compare")}>
                  <Link to="/compare">
                    <Layers className="h-4 w-4" />
                    <span>Compare Algorithms</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/disk-scheduling")}>
                  <Link to="/disk-scheduling">
                    <HardDrive className="h-4 w-4" />
                    <span>Disk Scheduling</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/page-replacement")}>
                  <Link to="/page-replacement">
                    <Layers className="h-4 w-4" />
                    <span>Page Replacement</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>CPU Scheduling</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {cpuSchedulingItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.path)}
                    className={cn(
                      "text-sm",
                      isActive(item.path) ? "bg-vivid-purple/20" : ""
                    )}
                  >
                    <Link to={item.path}>
                      <ArrowRight className="h-3 w-3" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-4 py-2">
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/about")}>
              <Link to="/about">
                <Cog className="h-4 w-4" />
                <span>About</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </div>
        <div className="px-4 py-2 text-xs text-center text-muted-foreground">
          CPU Scheduling Visualizer v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

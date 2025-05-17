
import { Link } from "react-router-dom";
import { ArrowRight, Cpu, HardDrive, Layers, CircleArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Log to help debug the SidebarTrigger issue
console.log("Index.tsx is loading");

const algorithmCards = [
  {
    id: "fcfs",
    name: "First Come First Serve (FCFS)",
    description: "Non-preemptive algorithm that processes tasks in order of arrival.",
    color: "bg-gradient-to-r from-blue-500 to-blue-600",
  },
  {
    id: "sjf",
    name: "Shortest Job First (SJF)",
    description: "Non-preemptive algorithm that processes shortest tasks first.",
    color: "bg-gradient-to-r from-purple-500 to-purple-600",
  },
  {
    id: "rr",
    name: "Round Robin (RR)",
    description: "Preemptive algorithm that allocates fixed time slices to each process.",
    color: "bg-gradient-to-r from-green-500 to-green-600",
  },
  {
    id: "ljf",
    name: "Longest Job First (LJF)",
    description: "Non-preemptive algorithm that processes longest tasks first.",
    color: "bg-gradient-to-r from-yellow-500 to-yellow-600", 
  },
  {
    id: "priority",
    name: "Priority Scheduling",
    description: "Processes tasks based on priority values.",
    color: "bg-gradient-to-r from-red-500 to-red-600",
  },
  {
    id: "lrtf",
    name: "Longest Remaining Time First",
    description: "Preemptive version of LJF.",
    color: "bg-gradient-to-r from-orange-500 to-orange-600",
  },
  {
    id: "srtf",
    name: "Shortest Remaining Time First",
    description: "Preemptive version of SJF.",
    color: "bg-gradient-to-r from-pink-500 to-pink-600",
  },
];

const otherAlgorithms = [
  {
    id: "disk-scheduling",
    name: "Disk Scheduling",
    description: "Algorithms for disk access optimization: FCFS, SSTF, SCAN, C-SCAN, LOOK.",
    icon: HardDrive,
    path: "/disk-scheduling",
  },
  {
    id: "page-replacement",
    name: "Page Replacement",
    description: "Memory management algorithms: FIFO, LRU, OPT, MRU, and more.",
    icon: Layers,
    path: "/page-replacement",
  },
  {
    id: "compare",
    name: "Compare Algorithms",
    description: "Compare multiple CPU scheduling algorithms side by side.",
    icon: CircleArrowUp,
    path: "/compare",
  },
];

const Index = () => {
  return (
    <>
      <AppSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">CPU Scheduling Visualizer</h1>
            <p className="text-muted-foreground mt-1">
              Interactive visualizations for CPU scheduling algorithms
            </p>
          </div>
          <SidebarTrigger>
            <Button variant="outline" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </SidebarTrigger>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-radial from-violet-500/20 to-transparent rounded-3xl -z-10" />
          <div className="grid-pattern absolute inset-0 rounded-3xl -z-10 opacity-50" />
          <div className="glassmorphism rounded-3xl p-8 mb-10">
            <div className="flex items-center">
              <Cpu className="h-8 w-8 text-vivid-purple mr-4" />
              <div>
                <h2 className="text-2xl font-bold">Interactive Visualization Platform</h2>
                <p className="text-muted-foreground mt-1">
                  Explore and understand CPU scheduling algorithms through interactive visualizations
                </p>
              </div>
            </div>
            <p className="mt-4">
              This platform offers interactive visualizations for various CPU scheduling algorithms,
              allowing you to understand their behavior, efficiency, and performance characteristics.
              Add processes, adjust parameters, and see real-time execution.
            </p>
            <div className="mt-4 flex gap-2">
              <Button asChild>
                <Link to="/algorithm/fcfs">Start Exploring</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4 mt-8">CPU Scheduling Algorithms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {algorithmCards.map((algorithm) => (
            <Card key={algorithm.id} className="overflow-hidden animate-fade-in">
              <CardHeader className={`text-white ${algorithm.color}`}>
                <CardTitle>{algorithm.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <CardDescription className="text-base">{algorithm.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="w-full justify-between">
                  <Link to={`/algorithm/${algorithm.id}`}>
                    <span>Visualize</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4 mt-8">Additional Algorithms</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {otherAlgorithms.map((algorithm) => (
            <Card key={algorithm.id} className="animate-fade-in">
              <CardHeader>
                <div className="flex items-center mb-2">
                  <algorithm.icon className="h-5 w-5 mr-2 text-vivid-purple" />
                  <CardTitle className="text-lg">{algorithm.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{algorithm.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to={algorithm.path}>Explore</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default Index;

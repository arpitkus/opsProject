import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Cpu } from "lucide-react";

const About = () => {
  return (
    <>
      <AppSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">About</h1>
            <p className="text-muted-foreground mt-1">
              Learn about CPU scheduling algorithms and this visualizer
            </p>
          </div>
          <SidebarTrigger>
            <Button variant="outline" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </SidebarTrigger>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-md">
            <div className="flex items-center mb-6">
              <Cpu className="h-12 w-12 text-vivid-purple mr-4" />
              <h2 className="text-2xl font-bold">CPU Scheduling Algorithm Visualizer</h2>
            </div>
            
            <div className="prose">
              <p className="text-lg">
                This interactive tool helps you understand CPU scheduling algorithms through visual demonstrations. By simulating how different algorithms handle process execution, you can gain insights into their efficiency, fairness, and performance characteristics.
              </p>
              
              <h3 className="text-xl font-semibold mt-6">Key Metrics Explained</h3>
              
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gray-50">
                  <h4 className="font-medium">Waiting Time</h4>
                  <p className="text-sm">The time a process spends waiting in the ready queue before execution.</p>
                </div>
                
                <div className="p-4 rounded-lg bg-gray-50">
                  <h4 className="font-medium">Turnaround Time</h4>
                  <p className="text-sm">The total time taken from submission to completion of a process.</p>
                </div>
                
                <div className="p-4 rounded-lg bg-gray-50">
                  <h4 className="font-medium">Response Time</h4>
                  <p className="text-sm">The time from process submission to the first CPU response.</p>
                </div>
                
                <div className="p-4 rounded-lg bg-gray-50">
                  <h4 className="font-medium">CPU Utilization</h4>
                  <p className="text-sm">The percentage of time the CPU is busy processing tasks.</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mt-6">Implemented Algorithms</h3>
              
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="font-medium">First Come First Serve (FCFS)</h4>
                  <p className="text-sm">Processes are executed in order of arrival. Simple but can lead to the convoy effect where short processes wait behind long ones.</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Shortest Job First (SJF)</h4>
                  <p className="text-sm">Prioritizes processes with the shortest execution time. Optimal for minimizing average waiting time but can cause starvation.</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Round Robin (RR)</h4>
                  <p className="text-sm">Allocates a fixed time quantum to each process in a circular queue. Fair but performance depends on quantum size.</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Longest Job First (LJF)</h4>
                  <p className="text-sm">Prioritizes processes with the longest execution time. Generally not efficient but useful for comparison.</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Priority Scheduling</h4>
                  <p className="text-sm">Executes processes based on priority values. Flexible but can lead to starvation of low-priority processes.</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Shortest Remaining Time First (SRTF)</h4>
                  <p className="text-sm">Preemptive version of SJF. Switches to a shorter job if one arrives.</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Longest Remaining Time First (LRTF)</h4>
                  <p className="text-sm">Preemptive version of LJF. Switches to a longer job if one arrives.</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mt-6">Using the Visualizer</h3>
              
              <ol className="mt-4 list-decimal list-inside space-y-2">
                <li>Select an algorithm from the sidebar</li>
                <li>Add processes with their arrival times and burst times</li>
                <li>For Round Robin, set the time quantum</li>
                <li>Click "Run Simulation" to calculate results</li>
                <li>Use the playback controls to animate the visualization</li>
                <li>Analyze the results and performance metrics</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;

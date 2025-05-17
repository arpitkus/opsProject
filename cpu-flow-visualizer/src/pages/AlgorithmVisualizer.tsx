import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import ProcessForm from "@/components/ProcessForm";
import ProcessTable from "@/components/ProcessTable";
import GanttChart from "@/components/GanttChart";
import ResultStats from "@/components/ResultStats";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Play, Pause, RefreshCw, ArrowRight } from "lucide-react";
import { Process, AlgorithmType } from "@/types/scheduler";
import { runAlgorithm } from "@/utils/schedulingAlgorithms";
import { Card } from "@/components/ui/card";

const algorithmTitles: Record<string, string> = {
  fcfs: "First Come First Serve (FCFS)",
  sjf: "Shortest Job First (SJF)",
  rr: "Round Robin (RR)",
  ljf: "Longest Job First (LJF)",
  priority: "Priority Scheduling",
  lrtf: "Longest Remaining Time First (LRTF)",
  srtf: "Shortest Remaining Time First (SRTF)"
};

const algorithmDescriptions: Record<string, string> = {
  fcfs: "Processes are executed in order of arrival. Non-preemptive.",
  sjf: "Process with the shortest burst time is executed first. Non-preemptive.",
  rr: "Each process is assigned a fixed time slice in a circular queue. Preemptive.",
  ljf: "Process with the longest burst time is executed first. Non-preemptive.",
  priority: "Process with the highest priority (lowest number) is executed first. Non-preemptive.",
  lrtf: "Process with the longest remaining time is executed first. Preemptive.",
  srtf: "Process with the shortest remaining time is executed first. Preemptive."
};

const AlgorithmVisualizer = () => {
  const { id } = useParams<{ id: string }>();
  const algorithmType = id as AlgorithmType;
  
  const [processes, setProcesses] = useState<Process[]>([]);
  const [timeQuantum, setTimeQuantum] = useState<number>(2);
  const [result, setResult] = useState<any>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [currentProcessId, setCurrentProcessId] = useState<string | null>(null);

  // Reset simulation state when algorithm changes
  useEffect(() => {
    setProcesses([]);
    setResult(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentProcessId(null);
  }, [algorithmType]);

  // Run the animation
  useEffect(() => {
    if (!isPlaying || !result) return;

    const totalDuration = result.ganttChart[result.ganttChart.length - 1].end;
    
    if (currentTime >= totalDuration) {
      setIsPlaying(false);
      setCurrentTime(totalDuration);
      return;
    }

    const interval = setInterval(() => {
      setCurrentTime(prevTime => {
        const nextTime = prevTime + 1;
        
        // Update current process ID
        const currentBlock = result.ganttChart.find(
          (block: any) => nextTime >= block.start && nextTime < block.end
        );
        
        if (currentBlock) {
          setCurrentProcessId(currentBlock.processId === "idle" ? null : currentBlock.processId);
        } else {
          setCurrentProcessId(null);
        }
        
        if (nextTime >= totalDuration) {
          setIsPlaying(false);
          return totalDuration;
        }
        return nextTime;
      });
    }, 1000 / simulationSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, result, currentTime, simulationSpeed]);

  const handleAddProcess = (process: Process) => {
    // Check if process ID already exists
    if (processes.some(p => p.id === process.id)) {
      toast({
        title: "Duplicate ID",
        description: `Process with ID ${process.id} already exists`,
        variant: "destructive"
      });
      return;
    }

    setProcesses([...processes, process]);
    setResult(null);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleDeleteProcess = (id: string) => {
    setProcesses(processes.filter(p => p.id !== id));
    setResult(null);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleClearAll = () => {
    setProcesses([]);
    setResult(null);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const generateRandomProcesses = (count: number) => {
    // Clear existing processes
    handleClearAll();
    
    const newProcesses: Process[] = [];
    const usedIds = new Set<string>();
    
    for (let i = 0; i < count; i++) {
      // Generate a unique process ID
      let processId = `P${i + 1}`;
      while (usedIds.has(processId)) {
        const randomNum = Math.floor(Math.random() * 100);
        processId = `P${randomNum}`;
      }
      usedIds.add(processId);
      
      // Generate random arrival and burst times
      const arrivalTime = Math.floor(Math.random() * 10); // 0-9
      const burstTime = Math.floor(Math.random() * 9) + 1; // 1-10
      
      // Generate random priority (only relevant for priority scheduling)
      const priority = Math.floor(Math.random() * 10) + 1; // 1-10
      
      // Generate random color
      const colors = [
        "#8B5CF6", // Violet
        "#3B82F6", // Blue
        "#10B981", // Green
        "#F59E0B", // Amber
        "#EF4444", // Red
        "#EC4899", // Pink
        "#6366F1", // Indigo
        "#0EA5E9", // Sky
        "#14B8A6", // Teal
        "#F97316", // Orange
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      newProcesses.push({
        id: processId,
        arrivalTime,
        burstTime,
        priority,
        remainingTime: burstTime,
        startTime: -1,
        completionTime: -1,
        waitingTime: -1,
        turnaroundTime: -1,
        responseTime: -1,
        color
      });
    }
    
    setProcesses(newProcesses);
    toast({
      title: "Random Processes Generated",
      description: `Created ${count} random processes`
    });
  };

  const runSimulation = () => {
    if (processes.length === 0) {
      toast({
        title: "No processes",
        description: "Add at least one process to run the simulation",
        variant: "destructive"
      });
      return;
    }

    try {
      const simulationResult = runAlgorithm(processes, algorithmType, timeQuantum);
      
      // This is the key fix: Update the processes state with the calculated result processes
      // so that the table shows the updated metrics
      setProcesses(simulationResult.processes);
      setResult(simulationResult);
      setCurrentTime(0);
      toast({
        title: "Simulation ready",
        description: "Click play to start the animation"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to run simulation: ${error}`,
        variant: "destructive"
      });
    }
  };

  const togglePlayPause = () => {
    if (!result) {
      runSimulation();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const resetSimulation = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  return (
    <>
      <AppSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{algorithmTitles[algorithmType] || "Algorithm Visualizer"}</h1>
            <p className="text-muted-foreground mt-1">
              {algorithmDescriptions[algorithmType] || "CPU scheduling algorithm visualization"}
            </p>
          </div>
          <SidebarTrigger>
            <Button variant="outline" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </SidebarTrigger>
        </div>

        <div className="grid gap-6">
          <ProcessForm 
            onAddProcess={handleAddProcess} 
            onClearAll={handleClearAll} 
            algorithmType={algorithmType}
            onGenerateRandom={generateRandomProcesses}
          />

          {algorithmType === "rr" && (
            <div className="bg-white rounded-lg border p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="timeQuantum">Time Quantum</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      id="timeQuantum"
                      type="number"
                      min="1"
                      value={timeQuantum}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value > 0) {
                          setTimeQuantum(value);
                          setResult(null);
                          setCurrentTime(0);
                          setIsPlaying(false);
                        }
                      }}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">time units per process</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {processes.length > 0 && (
            <ProcessTable 
              processes={result ? result.processes : processes} 
              onDeleteProcess={!result ? handleDeleteProcess : undefined}
              currentProcess={currentProcessId}
              showDetailedStats={!!result}
            />
          )}

          {result && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isPlaying ? "outline" : "default"}
                      size="icon"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={resetSimulation}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex-1 space-y-2 w-full sm:w-auto">
                    <div className="flex items-center justify-between">
                      <Label>Simulation Speed</Label>
                      <span className="text-sm">{simulationSpeed}x</span>
                    </div>
                    <Slider
                      min={0.25}
                      max={4}
                      step={0.25}
                      value={[simulationSpeed]}
                      onValueChange={([value]) => setSimulationSpeed(value)}
                      className="w-full sm:w-[200px]"
                    />
                  </div>

                  <div className="flex-1 space-y-2 w-full sm:w-auto">
                    <div className="flex items-center justify-between">
                      <Label>Current Time</Label>
                      <span className="text-sm">{currentTime}</span>
                    </div>
                    <Slider
                      min={0}
                      max={result.ganttChart[result.ganttChart.length - 1].end}
                      step={1}
                      value={[currentTime]}
                      onValueChange={([value]) => {
                        setCurrentTime(value);
                        
                        // Update current process ID
                        const currentBlock = result.ganttChart.find(
                          (block: any) => value >= block.start && value < block.end
                        );
                        
                        if (currentBlock) {
                          setCurrentProcessId(
                            currentBlock.processId === "idle" ? null : currentBlock.processId
                          );
                        } else {
                          setCurrentProcessId(null);
                        }
                      }}
                      className="w-full sm:w-[300px]"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  {currentProcessId ? (
                    <Card className="p-2 inline-flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ 
                          backgroundColor: processes.find(p => p.id === currentProcessId)?.color || "#000" 
                        }} 
                      />
                      <span className="font-medium">
                        Currently Running: {currentProcessId}
                      </span>
                    </Card>
                  ) : (
                    <Card className="p-2 inline-flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-gray-300" />
                      <span className="font-medium">CPU Idle</span>
                    </Card>
                  )}
                </div>
              </div>

              <GanttChart 
                ganttBlocks={result.ganttChart}
                isAnimating={isPlaying}
                currentTime={currentTime}
                autoScroll={true}
              />
              
              <ResultStats result={result} />
            </div>
          )}

          {!result && processes.length > 0 && (
            <div className="flex justify-center">
              <Button onClick={runSimulation} className="mt-4">
                Run Simulation
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AlgorithmVisualizer;
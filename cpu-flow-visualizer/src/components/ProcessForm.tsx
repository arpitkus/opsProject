
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash, Shuffle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Process } from "@/types/scheduler";

interface ProcessFormProps {
  onAddProcess: (process: Process) => void;
  onClearAll: () => void;
  algorithmType: string;
  onGenerateRandom: (count: number) => void;
}

const ProcessForm = ({ onAddProcess, onClearAll, algorithmType, onGenerateRandom }: ProcessFormProps) => {
  const [processId, setProcessId] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [burstTime, setBurstTime] = useState("");
  const [priority, setPriority] = useState("");
  const [randomCount, setRandomCount] = useState("5");

  const resetForm = () => {
    setProcessId("");
    setArrivalTime("");
    setBurstTime("");
    setPriority("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!processId || !burstTime) {
      toast({ 
        title: "Missing Information",
        description: "Please provide a process ID and burst time",
        variant: "destructive" 
      });
      return;
    }
    
    const newProcess: Process = {
      id: processId,
      arrivalTime: parseInt(arrivalTime) || 0,
      burstTime: parseInt(burstTime) || 1,
      priority: parseInt(priority) || 0,
      remainingTime: parseInt(burstTime) || 1,
      startTime: -1,
      completionTime: -1,
      waitingTime: -1,
      turnaroundTime: -1,
      responseTime: -1,
      color: generateRandomColor(),
    };
    
    onAddProcess(newProcess);
    toast({ title: "Process Added", description: `Added process ${processId}` });
    resetForm();
  };

  const generateRandomColor = () => {
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
    
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleGenerateRandom = () => {
    const count = parseInt(randomCount) || 5;
    if (count <= 0 || count > 10) {
      toast({ 
        title: "Invalid Count",
        description: "Please enter a number between 1 and 10",
        variant: "destructive" 
      });
      return;
    }
    onGenerateRandom(count);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg border shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Add Process</h3>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            type="button"
            onClick={onClearAll}
          >
            <Trash className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="processId">Process ID</Label>
          <Input
            id="processId"
            placeholder="P1, P2, etc."
            value={processId}
            onChange={(e) => setProcessId(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="arrivalTime">Arrival Time</Label>
          <Input
            id="arrivalTime"
            type="number"
            min="0"
            placeholder="0"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="burstTime">Burst Time</Label>
          <Input
            id="burstTime"
            type="number"
            min="1"
            placeholder="1"
            value={burstTime}
            onChange={(e) => setBurstTime(e.target.value)}
          />
        </div>
        
        {algorithmType === "priority" && (
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Input
              id="priority"
              type="number"
              min="1"
              placeholder="1"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Lower value = Higher priority</p>
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <Button type="submit" className="flex-1">
          <Plus className="h-4 w-4 mr-1" />
          Add Process
        </Button>
        
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="1"
            max="10"
            value={randomCount}
            onChange={(e) => setRandomCount(e.target.value)}
            className="w-16"
          />
          <Button 
            type="button" 
            variant="outline"
            className="flex-1"
            onClick={handleGenerateRandom}
          >
            <Shuffle className="h-4 w-4 mr-1" />
            Generate Random
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProcessForm;

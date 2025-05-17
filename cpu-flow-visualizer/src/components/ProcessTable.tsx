
import { Process } from "@/types/scheduler";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash } from "lucide-react";
import { Button } from "./ui/button";

interface ProcessTableProps {
  processes: Process[];
  onDeleteProcess?: (id: string) => void;
  showDetailedStats?: boolean;
  currentProcess?: string | null;
}

const ProcessTable: React.FC<ProcessTableProps> = ({
  processes,
  onDeleteProcess,
  showDetailedStats = false,
  currentProcess = null,
}) => {
  if (!processes.length) {
    return (
      <div className="bg-white rounded-lg border p-6 text-center shadow-sm">
        <p className="text-muted-foreground">No processes added yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-auto">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-lg font-medium">Process List</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow className="hover:bg-gray-50/80">
              <TableHead className="w-10"></TableHead>
              <TableHead className="font-semibold">Process ID</TableHead>
              <TableHead className="font-semibold">Arrival Time</TableHead>
              <TableHead className="font-semibold">Burst Time</TableHead>
              {showDetailedStats && (
                <>
                  <TableHead className="font-semibold">Start Time</TableHead>
                  <TableHead className="font-semibold">Completion Time</TableHead>
                  <TableHead className="font-semibold">Turnaround Time</TableHead>
                  <TableHead className="font-semibold">Waiting Time</TableHead>
                  <TableHead className="font-semibold">Response Time</TableHead>
                </>
              )}
              {onDeleteProcess && <TableHead className="w-16"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {processes.map((process) => (
              <TableRow 
                key={process.id}
                className={
                  process.id === currentProcess
                    ? "bg-primary/10 animate-pulse"
                    : "hover:bg-gray-50"
                }
              >
                <TableCell>
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: process.color }} 
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <span className={process.id === currentProcess ? "text-primary font-bold" : ""}>
                    {process.id}
                  </span>
                </TableCell>
                <TableCell>{process.arrivalTime}</TableCell>
                <TableCell>{process.burstTime}</TableCell>
                
                {showDetailedStats && (
                  <>
                    <TableCell className="font-mono">
                      {process.startTime !== undefined && process.startTime >= 0 ? process.startTime : "-"}
                    </TableCell>
                    <TableCell className="font-mono">
                      {process.completionTime !== undefined && process.completionTime >= 0 ? process.completionTime : "-"}
                    </TableCell>
                    <TableCell className={`font-mono ${process.turnaroundTime !== undefined && process.turnaroundTime >= 0 ? "text-blue-600 font-semibold" : ""}`}>
                      {process.turnaroundTime !== undefined && process.turnaroundTime >= 0 ? process.turnaroundTime : "-"}
                    </TableCell>
                    <TableCell className={`font-mono ${process.waitingTime !== undefined && process.waitingTime >= 0 ? "text-purple-600 font-semibold" : ""}`}>
                      {process.waitingTime !== undefined && process.waitingTime >= 0 ? process.waitingTime : "-"}
                    </TableCell>
                    <TableCell className={`font-mono ${process.responseTime !== undefined && process.responseTime >= 0 ? "text-green-600 font-semibold" : ""}`}>
                      {process.responseTime !== undefined && process.responseTime >= 0 ? process.responseTime : "-"}
                    </TableCell>
                  </>
                )}
                
                {onDeleteProcess && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteProcess(process.id)}
                      className="hover:bg-red-100 hover:text-red-600 transition-colors"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProcessTable;

import { AlgorithmResult } from "@/types/scheduler";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Percent, ArrowRight } from "lucide-react";

interface ResultStatsProps {
  result: AlgorithmResult;
}

const ResultStats: React.FC<ResultStatsProps> = ({ result }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Waiting Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{result.averageWaitingTime.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            time units
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Turnaround Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{result.averageTurnaroundTime.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            time units
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{result.averageResponseTime.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            time units
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CPU Utilization</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{result.cpuUtilization.toFixed(2)}%</div>
          <div className="mt-1 h-2 w-full bg-gray-200 rounded-full">
            <div 
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${result.cpuUtilization}%` }}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Throughput</CardTitle>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{result.throughput.toFixed(4)}</div>
          <p className="text-xs text-muted-foreground">
            processes per time unit
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultStats;

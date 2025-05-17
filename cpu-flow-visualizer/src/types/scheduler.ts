
export interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  remainingTime: number;
  startTime: number;
  completionTime: number;
  waitingTime: number;
  turnaroundTime: number;
  responseTime: number;
  color: string;
}

export interface GanttChartBlock {
  processId: string;
  start: number;
  end: number;
  color: string;
}

export interface AlgorithmResult {
  ganttChart: GanttChartBlock[];
  processes: Process[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  averageResponseTime: number;
  cpuUtilization: number;
  throughput: number;
}

export type AlgorithmType = 'fcfs' | 'sjf' | 'rr' | 'ljf' | 'priority' | 'lrtf' | 'srtf';

export interface AlgorithmConfig {
  type: AlgorithmType;
  timeQuantum?: number;
}

export interface VisualizationStep {
  time: number;
  readyQueue: string[];
  currentProcess: string | null;
  completedProcesses: string[];
  ganttChart: GanttChartBlock[];
  message: string;
}

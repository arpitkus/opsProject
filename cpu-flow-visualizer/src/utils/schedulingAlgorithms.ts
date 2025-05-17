
import { Process, AlgorithmResult, GanttChartBlock, AlgorithmType } from "../types/scheduler";

// Helper function to deep clone process array
const cloneProcesses = (processes: Process[]): Process[] => {
  return JSON.parse(JSON.stringify(processes));
};

// FCFS Algorithm
export const runFCFS = (processes: Process[]): AlgorithmResult => {
  const result: AlgorithmResult = {
    ganttChart: [],
    processes: cloneProcesses(processes),
    averageWaitingTime: 0,
    averageTurnaroundTime: 0,
    averageResponseTime: 0,
    cpuUtilization: 0,
    throughput: 0
  };
  
  if (processes.length === 0) return result;
  
  // Sort processes by arrival time
  result.processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  let totalBurstTime = 0;
  
  for (const process of result.processes) {
    // If there's a gap between processes
    if (currentTime < process.arrivalTime) {
      // Add idle time to Gantt chart if needed
      result.ganttChart.push({
        processId: "idle",
        start: currentTime,
        end: process.arrivalTime,
        color: "#E5E7EB" // Gray color for idle time
      });
      
      currentTime = process.arrivalTime;
    }
    
    // Process starts execution
    process.startTime = currentTime;
    
    // Calculate response time (time from arrival to first execution)
    process.responseTime = process.startTime - process.arrivalTime;
    
    // Process completes execution
    process.completionTime = currentTime + process.burstTime;
    
    // Add to Gantt chart
    result.ganttChart.push({
      processId: process.id,
      start: currentTime,
      end: process.completionTime,
      color: process.color
    });
    
    // Update current time
    currentTime = process.completionTime;
    
    // Calculate turnaround time (completion time - arrival time)
    process.turnaroundTime = process.completionTime - process.arrivalTime;
    
    // Calculate waiting time (turnaround time - burst time)
    process.waitingTime = process.turnaroundTime - process.burstTime;
    
    // Update totals
    totalWaitingTime += process.waitingTime;
    totalTurnaroundTime += process.turnaroundTime;
    totalResponseTime += process.responseTime;
    totalBurstTime += process.burstTime;
  }
  
  // Calculate averages
  result.averageWaitingTime = totalWaitingTime / processes.length;
  result.averageTurnaroundTime = totalTurnaroundTime / processes.length;
  result.averageResponseTime = totalResponseTime / processes.length;
  
  // Calculate CPU utilization
  const totalTime = result.ganttChart[result.ganttChart.length - 1].end;
  result.cpuUtilization = (totalBurstTime / totalTime) * 100;
  
  // Calculate throughput
  result.throughput = processes.length / totalTime;
  
  return result;
};

// SJF (Shortest Job First) Algorithm
export const runSJF = (processes: Process[]): AlgorithmResult => {
  const result: AlgorithmResult = {
    ganttChart: [],
    processes: cloneProcesses(processes),
    averageWaitingTime: 0,
    averageTurnaroundTime: 0,
    averageResponseTime: 0,
    cpuUtilization: 0,
    throughput: 0
  };
  
  if (processes.length === 0) return result;
  
  const remainingProcesses = [...result.processes];
  
  let currentTime = 0;
  let completed = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  let totalBurstTime = 0;
  
  while (completed < processes.length) {
    // Filter processes that have arrived
    const availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
    
    if (availableProcesses.length > 0) {
      // Sort by burst time (shortest first)
      availableProcesses.sort((a, b) => a.burstTime - b.burstTime);
      
      const shortestProcess = availableProcesses[0];
      const index = remainingProcesses.findIndex(p => p.id === shortestProcess.id);
      
      // Remove the process from the remaining list
      remainingProcesses.splice(index, 1);
      
      // Process starts execution
      shortestProcess.startTime = currentTime;
      
      // Calculate response time
      shortestProcess.responseTime = shortestProcess.startTime - shortestProcess.arrivalTime;
      
      // Process completes execution
      shortestProcess.completionTime = currentTime + shortestProcess.burstTime;
      
      // Add to Gantt chart
      result.ganttChart.push({
        processId: shortestProcess.id,
        start: currentTime,
        end: shortestProcess.completionTime,
        color: shortestProcess.color
      });
      
      // Update current time
      currentTime = shortestProcess.completionTime;
      
      // Calculate turnaround time
      shortestProcess.turnaroundTime = shortestProcess.completionTime - shortestProcess.arrivalTime;
      
      // Calculate waiting time
      shortestProcess.waitingTime = shortestProcess.turnaroundTime - shortestProcess.burstTime;
      
      // Update totals
      totalWaitingTime += shortestProcess.waitingTime;
      totalTurnaroundTime += shortestProcess.turnaroundTime;
      totalResponseTime += shortestProcess.responseTime;
      totalBurstTime += shortestProcess.burstTime;
      
      completed++;
    } else {
      // No process available at this time, find the next arrival time
      const nextArrival = Math.min(...remainingProcesses.map(p => p.arrivalTime));
      
      // Add idle time to Gantt chart
      result.ganttChart.push({
        processId: "idle",
        start: currentTime,
        end: nextArrival,
        color: "#E5E7EB" // Gray color for idle time
      });
      
      currentTime = nextArrival;
    }
  }
  
  // Calculate averages
  result.averageWaitingTime = totalWaitingTime / processes.length;
  result.averageTurnaroundTime = totalTurnaroundTime / processes.length;
  result.averageResponseTime = totalResponseTime / processes.length;
  
  // Calculate CPU utilization
  const totalTime = result.ganttChart[result.ganttChart.length - 1].end;
  result.cpuUtilization = (totalBurstTime / totalTime) * 100;
  
  // Calculate throughput
  result.throughput = processes.length / totalTime;
  
  return result;
};

// Round Robin Algorithm
export const runRR = (processes: Process[], timeQuantum: number = 2): AlgorithmResult => {
  const result: AlgorithmResult = {
    ganttChart: [],
    processes: cloneProcesses(processes),
    averageWaitingTime: 0,
    averageTurnaroundTime: 0,
    averageResponseTime: 0,
    cpuUtilization: 0,
    throughput: 0
  };
  
  if (processes.length === 0) return result;
  
  // Initialize
  for (const process of result.processes) {
    process.remainingTime = process.burstTime;
  }
  
  // Sort by arrival time initially
  result.processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  const queue: Process[] = [];
  let currentTime = 0;
  let totalBurstTime = 0;
  
  // Set initial response times to -1 (not started)
  result.processes.forEach(p => {
    totalBurstTime += p.burstTime;
    p.startTime = -1;
    p.responseTime = -1;
  });
  
  while (true) {
    let allCompleted = true;
    
    // Check for new arrivals
    for (const process of result.processes) {
      if (process.remainingTime > 0) {
        allCompleted = false;
        
        if (process.arrivalTime <= currentTime && !queue.includes(process)) {
          queue.push(process);
        }
      }
    }
    
    if (allCompleted) break;
    
    // If queue is empty, find the next arrival
    if (queue.length === 0) {
      const nextArrivalProcess = result.processes
        .filter(p => p.arrivalTime > currentTime && p.remainingTime > 0)
        .sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
      
      if (nextArrivalProcess) {
        // Add idle time to Gantt chart
        result.ganttChart.push({
          processId: "idle",
          start: currentTime,
          end: nextArrivalProcess.arrivalTime,
          color: "#E5E7EB" // Gray color for idle time
        });
        
        currentTime = nextArrivalProcess.arrivalTime;
        queue.push(nextArrivalProcess);
      } else {
        break;
      }
    }
    
    // Get next process from queue
    const currentProcess = queue.shift()!;
    
    // Set start time if this is the first time the process runs
    if (currentProcess.startTime === -1) {
      currentProcess.startTime = currentTime;
      currentProcess.responseTime = currentProcess.startTime - currentProcess.arrivalTime;
    }
    
    // Calculate actual execution time (either full quantum or remaining time)
    const executionTime = Math.min(timeQuantum, currentProcess.remainingTime);
    
    // Add to Gantt chart
    result.ganttChart.push({
      processId: currentProcess.id,
      start: currentTime,
      end: currentTime + executionTime,
      color: currentProcess.color
    });
    
    // Update times
    currentTime += executionTime;
    currentProcess.remainingTime -= executionTime;
    
    // If process is complete, calculate completion time
    if (currentProcess.remainingTime === 0) {
      currentProcess.completionTime = currentTime;
      currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
      currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
    } else {
      // Process still has remaining time, put it back in the queue
      // but check for new arrivals first
      const newArrivals = result.processes.filter(p => 
        p.arrivalTime <= currentTime && 
        p.remainingTime > 0 && 
        !queue.includes(p) && 
        p !== currentProcess
      );
      
      queue.push(...newArrivals, currentProcess);
    }
  }
  
  // Calculate averages
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  
  for (const process of result.processes) {
    totalWaitingTime += process.waitingTime;
    totalTurnaroundTime += process.turnaroundTime;
    totalResponseTime += process.responseTime;
  }
  
  result.averageWaitingTime = totalWaitingTime / processes.length;
  result.averageTurnaroundTime = totalTurnaroundTime / processes.length;
  result.averageResponseTime = totalResponseTime / processes.length;
  
  // Calculate CPU utilization
  const totalTime = result.ganttChart[result.ganttChart.length - 1].end;
  result.cpuUtilization = (totalBurstTime / totalTime) * 100;
  
  // Calculate throughput
  result.throughput = processes.length / totalTime;
  
  return result;
};

// Longest Job First (LJF) Algorithm
export const runLJF = (processes: Process[]): AlgorithmResult => {
  const result: AlgorithmResult = {
    ganttChart: [],
    processes: cloneProcesses(processes),
    averageWaitingTime: 0,
    averageTurnaroundTime: 0,
    averageResponseTime: 0,
    cpuUtilization: 0,
    throughput: 0
  };
  
  if (processes.length === 0) return result;
  
  const remainingProcesses = [...result.processes];
  
  let currentTime = 0;
  let completed = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  let totalBurstTime = 0;
  
  while (completed < processes.length) {
    // Filter processes that have arrived
    const availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
    
    if (availableProcesses.length > 0) {
      // Sort by burst time (longest first)
      availableProcesses.sort((a, b) => b.burstTime - a.burstTime);
      
      const longestProcess = availableProcesses[0];
      const index = remainingProcesses.findIndex(p => p.id === longestProcess.id);
      
      // Remove the process from the remaining list
      remainingProcesses.splice(index, 1);
      
      // Process starts execution
      longestProcess.startTime = currentTime;
      
      // Calculate response time
      longestProcess.responseTime = longestProcess.startTime - longestProcess.arrivalTime;
      
      // Process completes execution
      longestProcess.completionTime = currentTime + longestProcess.burstTime;
      
      // Add to Gantt chart
      result.ganttChart.push({
        processId: longestProcess.id,
        start: currentTime,
        end: longestProcess.completionTime,
        color: longestProcess.color
      });
      
      // Update current time
      currentTime = longestProcess.completionTime;
      
      // Calculate turnaround time
      longestProcess.turnaroundTime = longestProcess.completionTime - longestProcess.arrivalTime;
      
      // Calculate waiting time
      longestProcess.waitingTime = longestProcess.turnaroundTime - longestProcess.burstTime;
      
      // Update totals
      totalWaitingTime += longestProcess.waitingTime;
      totalTurnaroundTime += longestProcess.turnaroundTime;
      totalResponseTime += longestProcess.responseTime;
      totalBurstTime += longestProcess.burstTime;
      
      completed++;
    } else {
      // No process available at this time, find the next arrival time
      const nextArrival = Math.min(...remainingProcesses.map(p => p.arrivalTime));
      
      // Add idle time to Gantt chart
      result.ganttChart.push({
        processId: "idle",
        start: currentTime,
        end: nextArrival,
        color: "#E5E7EB" // Gray color for idle time
      });
      
      currentTime = nextArrival;
    }
  }
  
  // Calculate averages
  result.averageWaitingTime = totalWaitingTime / processes.length;
  result.averageTurnaroundTime = totalTurnaroundTime / processes.length;
  result.averageResponseTime = totalResponseTime / processes.length;
  
  // Calculate CPU utilization
  const totalTime = result.ganttChart[result.ganttChart.length - 1].end;
  result.cpuUtilization = (totalBurstTime / totalTime) * 100;
  
  // Calculate throughput
  result.throughput = processes.length / totalTime;
  
  return result;
};

// Priority Scheduling Algorithm
export const runPriority = (processes: Process[]): AlgorithmResult => {
  const result: AlgorithmResult = {
    ganttChart: [],
    processes: cloneProcesses(processes),
    averageWaitingTime: 0,
    averageTurnaroundTime: 0,
    averageResponseTime: 0,
    cpuUtilization: 0,
    throughput: 0
  };
  
  if (processes.length === 0) return result;
  
  const remainingProcesses = [...result.processes];
  
  let currentTime = 0;
  let completed = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  let totalBurstTime = 0;
  
  while (completed < processes.length) {
    // Filter processes that have arrived
    const availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
    
    if (availableProcesses.length > 0) {
      // Sort by priority (lower value = higher priority)
      availableProcesses.sort((a, b) => a.priority - b.priority);
      
      const highestPriorityProcess = availableProcesses[0];
      const index = remainingProcesses.findIndex(p => p.id === highestPriorityProcess.id);
      
      // Remove the process from the remaining list
      remainingProcesses.splice(index, 1);
      
      // Process starts execution
      highestPriorityProcess.startTime = currentTime;
      
      // Calculate response time
      highestPriorityProcess.responseTime = highestPriorityProcess.startTime - highestPriorityProcess.arrivalTime;
      
      // Process completes execution
      highestPriorityProcess.completionTime = currentTime + highestPriorityProcess.burstTime;
      
      // Add to Gantt chart
      result.ganttChart.push({
        processId: highestPriorityProcess.id,
        start: currentTime,
        end: highestPriorityProcess.completionTime,
        color: highestPriorityProcess.color
      });
      
      // Update current time
      currentTime = highestPriorityProcess.completionTime;
      
      // Calculate turnaround time
      highestPriorityProcess.turnaroundTime = highestPriorityProcess.completionTime - highestPriorityProcess.arrivalTime;
      
      // Calculate waiting time
      highestPriorityProcess.waitingTime = highestPriorityProcess.turnaroundTime - highestPriorityProcess.burstTime;
      
      // Update totals
      totalWaitingTime += highestPriorityProcess.waitingTime;
      totalTurnaroundTime += highestPriorityProcess.turnaroundTime;
      totalResponseTime += highestPriorityProcess.responseTime;
      totalBurstTime += highestPriorityProcess.burstTime;
      
      completed++;
    } else {
      // No process available at this time, find the next arrival time
      const nextArrival = Math.min(...remainingProcesses.map(p => p.arrivalTime));
      
      // Add idle time to Gantt chart
      result.ganttChart.push({
        processId: "idle",
        start: currentTime,
        end: nextArrival,
        color: "#E5E7EB" // Gray color for idle time
      });
      
      currentTime = nextArrival;
    }
  }
  
  // Calculate averages
  result.averageWaitingTime = totalWaitingTime / processes.length;
  result.averageTurnaroundTime = totalTurnaroundTime / processes.length;
  result.averageResponseTime = totalResponseTime / processes.length;
  
  // Calculate CPU utilization
  const totalTime = result.ganttChart[result.ganttChart.length - 1].end;
  result.cpuUtilization = (totalBurstTime / totalTime) * 100;
  
  // Calculate throughput
  result.throughput = processes.length / totalTime;
  
  return result;
};

// Shortest Remaining Time First (SRTF) Algorithm
export const runSRTF = (processes: Process[]): AlgorithmResult => {
  const result: AlgorithmResult = {
    ganttChart: [],
    processes: cloneProcesses(processes),
    averageWaitingTime: 0,
    averageTurnaroundTime: 0,
    averageResponseTime: 0,
    cpuUtilization: 0,
    throughput: 0
  };
  
  if (processes.length === 0) return result;
  
  // Initialize remaining times
  result.processes.forEach(p => {
    p.remainingTime = p.burstTime;
  });
  
  let currentTime = 0;
  let completed = 0;
  let prevProcess: string | null = null;
  let totalBurstTime = result.processes.reduce((sum, p) => sum + p.burstTime, 0);
  
  // Find the earliest arrival time
  const earliestArrival = Math.min(...result.processes.map(p => p.arrivalTime));
  currentTime = earliestArrival;
  
  while (completed < processes.length) {
    // Find the process with shortest remaining time that has arrived
    let shortestJob: Process | null = null;
    let shortestTime = Number.MAX_VALUE;
    
    for (const process of result.processes) {
      if (process.arrivalTime <= currentTime && process.remainingTime > 0) {
        if (process.remainingTime < shortestTime) {
          shortestJob = process;
          shortestTime = process.remainingTime;
        }
      }
    }
    
    // If no job is available, move to the next arrival time
    if (!shortestJob) {
      // Find the next process to arrive
      let nextArrival = Number.MAX_VALUE;
      for (const process of result.processes) {
        if (process.arrivalTime > currentTime && process.remainingTime > 0) {
          nextArrival = Math.min(nextArrival, process.arrivalTime);
        }
      }
      
      // Add idle time to Gantt chart
      if (prevProcess !== "idle") {
        result.ganttChart.push({
          processId: "idle",
          start: currentTime,
          end: nextArrival,
          color: "#E5E7EB" // Gray color for idle time
        });
        
        prevProcess = "idle";
      } else {
        // Update the end time of the last idle period
        result.ganttChart[result.ganttChart.length - 1].end = nextArrival;
      }
      
      currentTime = nextArrival;
      continue;
    }
    
    // Update start time if this is the first time the process runs
    if (shortestJob.startTime === -1) {
      shortestJob.startTime = currentTime;
      shortestJob.responseTime = shortestJob.startTime - shortestJob.arrivalTime;
    }
    
    // Find the next event time (either process completion or new arrival)
    let nextEventTime = currentTime + shortestJob.remainingTime;
    
    for (const process of result.processes) {
      if (process.arrivalTime > currentTime && process.arrivalTime < nextEventTime && process.remainingTime > 0) {
        nextEventTime = process.arrivalTime;
      }
    }
    
    // Execute the process until the next event
    const executedTime = nextEventTime - currentTime;
    shortestJob.remainingTime -= executedTime;
    
    // Add to Gantt chart or update if it's the same process
    if (prevProcess !== shortestJob.id) {
      result.ganttChart.push({
        processId: shortestJob.id,
        start: currentTime,
        end: nextEventTime,
        color: shortestJob.color
      });
      
      prevProcess = shortestJob.id;
    } else {
      // Update the end time of the last block for this process
      result.ganttChart[result.ganttChart.length - 1].end = nextEventTime;
    }
    
    // Update current time
    currentTime = nextEventTime;
    
    // Check if the process is completed
    if (shortestJob.remainingTime === 0) {
      shortestJob.completionTime = currentTime;
      shortestJob.turnaroundTime = shortestJob.completionTime - shortestJob.arrivalTime;
      shortestJob.waitingTime = shortestJob.turnaroundTime - shortestJob.burstTime;
      completed++;
    }
  }
  
  // Calculate averages
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  
  for (const process of result.processes) {
    totalWaitingTime += process.waitingTime;
    totalTurnaroundTime += process.turnaroundTime;
    totalResponseTime += process.responseTime;
  }
  
  result.averageWaitingTime = totalWaitingTime / processes.length;
  result.averageTurnaroundTime = totalTurnaroundTime / processes.length;
  result.averageResponseTime = totalResponseTime / processes.length;
  
  // Calculate CPU utilization
  const totalTime = result.ganttChart[result.ganttChart.length - 1].end;
  result.cpuUtilization = (totalBurstTime / totalTime) * 100;
  
  // Calculate throughput
  result.throughput = processes.length / totalTime;
  
  return result;
};

// Longest Remaining Time First (LRTF) Algorithm
export const runLRTF = (processes: Process[]): AlgorithmResult => {
  const result: AlgorithmResult = {
    ganttChart: [],
    processes: cloneProcesses(processes),
    averageWaitingTime: 0,
    averageTurnaroundTime: 0,
    averageResponseTime: 0,
    cpuUtilization: 0,
    throughput: 0
  };
  
  if (processes.length === 0) return result;
  
  // Initialize remaining times
  result.processes.forEach(p => {
    p.remainingTime = p.burstTime;
  });
  
  let currentTime = 0;
  let completed = 0;
  let prevProcess: string | null = null;
  let totalBurstTime = result.processes.reduce((sum, p) => sum + p.burstTime, 0);
  
  // Find the earliest arrival time
  const earliestArrival = Math.min(...result.processes.map(p => p.arrivalTime));
  currentTime = earliestArrival;
  
  while (completed < processes.length) {
    // Find the process with longest remaining time that has arrived
    let longestJob: Process | null = null;
    let longestTime = -1;
    
    for (const process of result.processes) {
      if (process.arrivalTime <= currentTime && process.remainingTime > 0) {
        if (process.remainingTime > longestTime) {
          longestJob = process;
          longestTime = process.remainingTime;
        }
      }
    }
    
    // If no job is available, move to the next arrival time
    if (!longestJob) {
      // Find the next process to arrive
      let nextArrival = Number.MAX_VALUE;
      for (const process of result.processes) {
        if (process.arrivalTime > currentTime && process.remainingTime > 0) {
          nextArrival = Math.min(nextArrival, process.arrivalTime);
        }
      }
      
      // Add idle time to Gantt chart
      if (prevProcess !== "idle") {
        result.ganttChart.push({
          processId: "idle",
          start: currentTime,
          end: nextArrival,
          color: "#E5E7EB" // Gray color for idle time
        });
        
        prevProcess = "idle";
      } else {
        // Update the end time of the last idle period
        result.ganttChart[result.ganttChart.length - 1].end = nextArrival;
      }
      
      currentTime = nextArrival;
      continue;
    }
    
    // Update start time if this is the first time the process runs
    if (longestJob.startTime === -1) {
      longestJob.startTime = currentTime;
      longestJob.responseTime = longestJob.startTime - longestJob.arrivalTime;
    }
    
    // Find the next event time (either process completion or new arrival)
    let nextEventTime = currentTime + longestJob.remainingTime;
    
    for (const process of result.processes) {
      if (process.arrivalTime > currentTime && process.arrivalTime < nextEventTime && process.remainingTime > 0) {
        nextEventTime = process.arrivalTime;
      }
    }
    
    // Execute the process until the next event
    const executedTime = nextEventTime - currentTime;
    longestJob.remainingTime -= executedTime;
    
    // Add to Gantt chart or update if it's the same process
    if (prevProcess !== longestJob.id) {
      result.ganttChart.push({
        processId: longestJob.id,
        start: currentTime,
        end: nextEventTime,
        color: longestJob.color
      });
      
      prevProcess = longestJob.id;
    } else {
      // Update the end time of the last block for this process
      result.ganttChart[result.ganttChart.length - 1].end = nextEventTime;
    }
    
    // Update current time
    currentTime = nextEventTime;
    
    // Check if the process is completed
    if (longestJob.remainingTime === 0) {
      longestJob.completionTime = currentTime;
      longestJob.turnaroundTime = longestJob.completionTime - longestJob.arrivalTime;
      longestJob.waitingTime = longestJob.turnaroundTime - longestJob.burstTime;
      completed++;
    }
  }
  
  // Calculate averages
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  
  for (const process of result.processes) {
    totalWaitingTime += process.waitingTime;
    totalTurnaroundTime += process.turnaroundTime;
    totalResponseTime += process.responseTime;
  }
  
  result.averageWaitingTime = totalWaitingTime / processes.length;
  result.averageTurnaroundTime = totalTurnaroundTime / processes.length;
  result.averageResponseTime = totalResponseTime / processes.length;
  
  // Calculate CPU utilization
  const totalTime = result.ganttChart[result.ganttChart.length - 1].end;
  result.cpuUtilization = (totalBurstTime / totalTime) * 100;
  
  // Calculate throughput
  result.throughput = processes.length / totalTime;
  
  return result;
};

// Export a function to run the selected algorithm
export const runAlgorithm = (
  processes: Process[], 
  algorithmType: AlgorithmType, 
  timeQuantum: number = 2
): AlgorithmResult => {
  switch (algorithmType) {
    case 'fcfs':
      return runFCFS(processes);
    case 'sjf':
      return runSJF(processes);
    case 'rr':
      return runRR(processes, timeQuantum);
    case 'ljf':
      return runLJF(processes);
    case 'priority':
      return runPriority(processes);
    case 'lrtf':
      return runLRTF(processes);
    case 'srtf':
      return runSRTF(processes);
    default:
      return runFCFS(processes);
  }
};

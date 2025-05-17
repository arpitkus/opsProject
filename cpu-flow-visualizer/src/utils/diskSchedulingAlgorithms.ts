export interface DiskRequest {
  id: string;
  position: number;
  color: string;
}

export interface DiskSchedulingResult {
  sequence: DiskRequest[];
  totalSeekTime: number;
  averageSeekTime: number;
}

export type DiskSchedulingAlgorithmType = 'fcfs' | 'sstf' | 'scan' | 'cscan' | 'look' | 'clook';

// FCFS (First Come First Served) Disk Scheduling Algorithm
export const runFCFS = (requests: DiskRequest[], initialPosition: number): DiskSchedulingResult => {
  const result: DiskSchedulingResult = {
    sequence: [],
    totalSeekTime: 0,
    averageSeekTime: 0
  };

  if (requests.length === 0) {
    return result;
  }

  let currentPosition = initialPosition;
  let sequence = [];
  let totalSeekTime = 0;

  // Simply process requests in the order they arrive
  for (const request of requests) {
    const seekDistance = Math.abs(currentPosition - request.position);
    totalSeekTime += seekDistance;
    
    sequence.push({
      ...request,
      seekDistance
    });
    
    currentPosition = request.position;
  }

  result.sequence = sequence;
  result.totalSeekTime = totalSeekTime;
  result.averageSeekTime = totalSeekTime / requests.length;

  return result;
};

// SSTF (Shortest Seek Time First) Disk Scheduling Algorithm
export const runSSTF = (requests: DiskRequest[], initialPosition: number): DiskSchedulingResult => {
  const result: DiskSchedulingResult = {
    sequence: [],
    totalSeekTime: 0,
    averageSeekTime: 0
  };

  if (requests.length === 0) {
    return result;
  }

  // Create a copy of the requests to avoid modifying the original
  const remainingRequests = [...requests];
  let currentPosition = initialPosition;
  let sequence = [];
  let totalSeekTime = 0;

  // Process requests until all are served
  while (remainingRequests.length > 0) {
    // Find the request with the shortest seek time from the current position
    let shortestIndex = 0;
    let shortestSeekTime = Math.abs(remainingRequests[0].position - currentPosition);

    for (let i = 1; i < remainingRequests.length; i++) {
      const seekTime = Math.abs(remainingRequests[i].position - currentPosition);
      if (seekTime < shortestSeekTime) {
        shortestSeekTime = seekTime;
        shortestIndex = i;
      }
    }

    // Add the selected request to the sequence
    const selectedRequest = remainingRequests[shortestIndex];
    totalSeekTime += shortestSeekTime;
    
    sequence.push({
      ...selectedRequest,
      seekDistance: shortestSeekTime
    });

    // Update current position and remove the processed request
    currentPosition = selectedRequest.position;
    remainingRequests.splice(shortestIndex, 1);
  }

  result.sequence = sequence;
  result.totalSeekTime = totalSeekTime;
  result.averageSeekTime = totalSeekTime / requests.length;

  return result;
};

// Function to execute the selected algorithm
export const runDiskSchedulingAlgorithm = (
  requests: DiskRequest[],
  initialPosition: number,
  algorithmType: DiskSchedulingAlgorithmType
): DiskSchedulingResult => {
  switch (algorithmType) {
    case 'fcfs':
      return runFCFS(requests, initialPosition);
    case 'sstf':
      return runSSTF(requests, initialPosition);
    // Other algorithms can be added here later
    default:
      return runFCFS(requests, initialPosition);
  }
};

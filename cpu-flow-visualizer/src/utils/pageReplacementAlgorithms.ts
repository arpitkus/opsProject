import { PageReference, PageFrame, PageReplacementResult, PageReplacementAlgorithmType, PageReplacementStep } from "../types/pageReplacement";

// Helper function to create an empty page frame
const createEmptyFrame = (id: string): PageFrame => ({
  id,
  value: null,
  isHit: false,
  isNewlyLoaded: false
});

// Helper function to clone frames
const cloneFrames = (frames: PageFrame[]): PageFrame[] => {
  return frames.map(frame => ({ ...frame }));
};

// FIFO (First In First Out) Page Replacement Algorithm
export const runFIFO = (references: PageReference[], frameCount: number): PageReplacementResult => {
  const result: PageReplacementResult = {
    frames: [],
    hits: 0,
    faults: 0,
    hitRatio: 0
  };

  if (references.length === 0 || frameCount <= 0) {
    return result;
  }

  // Initialize frames
  let frames: PageFrame[] = Array.from({ length: frameCount }, (_, i) => 
    createEmptyFrame(`frame-${i}`)
  );

  // Queue to track the order of page loading (for FIFO replacement)
  const loadOrder: number[] = [];

  // Process each page reference
  references.forEach((reference, index) => {
    // Make a copy of the current state before processing
    const currentFrames = cloneFrames(frames);

    // Check if the page is already in a frame (hit)
    const hitIndex = frames.findIndex(frame => frame.value === reference.value);
    let isHit = hitIndex !== -1;

    // Reset all frames' isNewlyLoaded flag
    frames.forEach(frame => {
      frame.isNewlyLoaded = false;
      frame.isHit = false;
    });

    if (isHit) {
      // Page hit
      frames[hitIndex].isHit = true;
      result.hits++;
    } else {
      // Page fault
      result.faults++;

      // Find an empty frame or the frame to replace using FIFO
      const emptyIndex = frames.findIndex(frame => frame.value === null);
      
      if (emptyIndex !== -1) {
        // Found an empty frame
        frames[emptyIndex].value = reference.value;
        frames[emptyIndex].isNewlyLoaded = true;
        loadOrder.push(emptyIndex);
      } else {
        // Need to replace using FIFO
        const replaceIndex = loadOrder.shift()!;
        loadOrder.push(replaceIndex);
        frames[replaceIndex].value = reference.value;
        frames[replaceIndex].isNewlyLoaded = true;
      }
    }

    // Save the state after processing this reference
    result.frames.push(cloneFrames(frames));
  });

  // Calculate hit ratio
  result.hitRatio = references.length > 0 ? (result.hits / references.length) * 100 : 0;

  return result;
};

// Least Recently Used (LRU) Page Replacement Algorithm
export const runLRU = (references: PageReference[], frameCount: number): PageReplacementResult => {
  const result: PageReplacementResult = {
    frames: [],
    hits: 0,
    faults: 0,
    hitRatio: 0
  };

  if (references.length === 0 || frameCount <= 0) {
    return result;
  }

  // Initialize frames
  let frames: PageFrame[] = Array.from({ length: frameCount }, (_, i) => 
    createEmptyFrame(`frame-${i}`)
  );

  // Array to track the order of page access (for LRU replacement)
  // The index is the page value and the value is the timestamp when it was last accessed
  const lastUsedTimes: number[] = [];

  // Process each page reference
  references.forEach((reference, index) => {
    // Check if the page is already in a frame (hit)
    const hitIndex = frames.findIndex(frame => frame.value === reference.value);
    let isHit = hitIndex !== -1;

    // Reset all frames' isNewlyLoaded and isHit flags
    frames.forEach(frame => {
      frame.isNewlyLoaded = false;
      frame.isHit = false;
    });

    if (isHit) {
      // Page hit
      frames[hitIndex].isHit = true;
      result.hits++;
      
      // Update last used time for this page
      lastUsedTimes[reference.value] = index;
    } else {
      // Page fault
      result.faults++;

      // Find an empty frame
      const emptyIndex = frames.findIndex(frame => frame.value === null);
      
      if (emptyIndex !== -1) {
        // Found an empty frame
        frames[emptyIndex].value = reference.value;
        frames[emptyIndex].isNewlyLoaded = true;
        // Record when this page was last used
        lastUsedTimes[reference.value] = index;
      } else {
        // Need to replace using LRU
        // Find the page that was least recently used
        let leastRecentlyUsedIndex = -1;
        let leastRecentlyUsedTime = Infinity;
        
        for (let i = 0; i < frames.length; i++) {
          const frameValue = frames[i].value;
          if (frameValue !== null && 
              (lastUsedTimes[frameValue] === undefined || 
               lastUsedTimes[frameValue] < leastRecentlyUsedTime)) {
            leastRecentlyUsedTime = lastUsedTimes[frameValue];
            leastRecentlyUsedIndex = i;
          }
        }
        
        // Replace the least recently used page
        frames[leastRecentlyUsedIndex].value = reference.value;
        frames[leastRecentlyUsedIndex].isNewlyLoaded = true;
        // Record when this page was last used
        lastUsedTimes[reference.value] = index;
      }
    }

    // Save the state after processing this reference
    result.frames.push(cloneFrames(frames));
  });

  // Calculate hit ratio
  result.hitRatio = references.length > 0 ? (result.hits / references.length) * 100 : 0;

  return result;
};

// Function to execute the selected algorithm
export const runPageReplacementAlgorithm = (
  references: PageReference[],
  frameCount: number,
  algorithmType: PageReplacementAlgorithmType
): PageReplacementResult => {
  switch (algorithmType) {
    case 'fifo':
      return runFIFO(references, frameCount);
    case 'lru':
      return runLRU(references, frameCount);
    // Other algorithms can be added here later
    default:
      return runFIFO(references, frameCount);
  }
};

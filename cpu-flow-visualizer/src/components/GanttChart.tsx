
import React, { useRef, useEffect, useState } from "react";
import { GanttChartBlock } from "@/types/scheduler";
import { cn } from "@/lib/utils";

interface GanttChartProps {
  ganttBlocks: GanttChartBlock[];
  autoScroll?: boolean;
  isAnimating?: boolean;
  currentTime?: number;
  onBlockHover?: (block: GanttChartBlock) => void;
}

const GanttChart: React.FC<GanttChartProps> = ({
  ganttBlocks,
  autoScroll = false,
  isAnimating = false,
  currentTime = 0,
  onBlockHover
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [tooltipContent, setTooltipContent] = useState<{ block: GanttChartBlock; x: number; y: number } | null>(null);
  
  // Calculate total duration and max scale for timeline
  const totalDuration = ganttBlocks.length > 0 
    ? Math.max(...ganttBlocks.map(block => block.end))
    : 0;
  
  // Auto scroll the chart as animation progresses
  useEffect(() => {
    if (autoScroll && isAnimating && scrollContainerRef.current) {
      const pixelsPerUnit = 60; // Width per time unit
      const targetScroll = currentTime * pixelsPerUnit - 300; // Keep current time visible with padding
      scrollContainerRef.current.scrollLeft = Math.max(0, targetScroll);
    }
  }, [currentTime, isAnimating, autoScroll]);

  // Handle mouse events for tooltips
  const handleMouseEnter = (e: React.MouseEvent, block: GanttChartBlock) => {
    if (block.processId === "idle") return;
    
    setTooltipContent({
      block,
      x: e.clientX,
      y: e.clientY
    });
    
    if (onBlockHover) {
      onBlockHover(block);
    }
  };
  
  const handleMouseLeave = () => {
    setTooltipContent(null);
  };
  
  // Helper function to generate time markers
  const generateTimeMarkers = () => {
    const markers = [];
    const markEvery = totalDuration > 50 ? 5 : 1; // Adjust marker density based on total duration
    
    for (let i = 0; i <= totalDuration; i += markEvery) {
      markers.push(
        <div 
          key={`marker-${i}`} 
          className="absolute flex flex-col items-center"
          style={{ left: `${i * 60}px` }}
        >
          <div className="h-4 border-l border-gray-300" />
          <div className="absolute -bottom-6 text-xs font-medium opacity-70 w-8 text-center">
            {i}
          </div>
        </div>
      );
    }
    
    return markers;
  };

  return (
    <div className="mt-4 mb-8 bg-white rounded-lg border p-4 shadow-sm">
      <h3 className="text-lg font-medium mb-2">Timeline</h3>
      
      <div 
        ref={scrollContainerRef}
        className="relative overflow-x-auto pb-8"
        style={{ maxWidth: "100%" }}
      >
        <div 
          className="relative min-h-[80px] pt-4"
          style={{ width: `${Math.max(100, (totalDuration + 1) * 60)}px` }}
        >
          {/* Time markers */}
          <div className="absolute top-0 left-0 right-0 h-6">
            {generateTimeMarkers()}
          </div>
          
          {/* Gantt blocks */}
          {ganttBlocks.map((block, index) => (
            <div
              key={`${block.processId}-${index}`}
              className={cn(
                "process-block absolute",
                block.processId === "idle" ? "bg-gray-200 text-gray-500" : "",
                isAnimating && currentTime >= block.start && currentTime <= block.end ? "animate-pulse" : ""
              )}
              style={{
                left: `${block.start * 60}px`,
                width: `${(block.end - block.start) * 60}px`,
                top: "30px", // Increased to make room for better time markers
                height: "40px",
                backgroundColor: block.processId === "idle" ? "#E5E7EB" : block.color,
                zIndex: block.processId === "idle" ? 0 : 1
              }}
              onMouseEnter={(e) => handleMouseEnter(e, block)}
              onMouseLeave={handleMouseLeave}
            >
              {block.processId !== "idle" && (
                <span className="text-sm font-medium truncate px-2 py-2 inline-flex items-center justify-center h-full w-full">
                  {block.processId} ({block.end - block.start})
                </span>
              )}
            </div>
          ))}
          
          {/* Current time marker - made more visible */}
          {isAnimating && (
            <div
              className="absolute top-0 bottom-0 w-2 bg-red-500 shadow-lg"
              style={{
                left: `${currentTime * 60}px`,
                zIndex: 10,
                transform: "translateX(-50%)"
              }}
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                {currentTime}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Tooltip */}
      {tooltipContent && (
        <div
          className="fixed bg-black text-white p-2 rounded text-sm z-50"
          style={{
            top: tooltipContent.y - 70,
            left: tooltipContent.x + 10,
          }}
        >
          <p>Process: {tooltipContent.block.processId}</p>
          <p>Start: {tooltipContent.block.start}</p>
          <p>End: {tooltipContent.block.end}</p>
          <p>Duration: {tooltipContent.block.end - tooltipContent.block.start}</p>
        </div>
      )}
    </div>
  );
};

export default GanttChart;

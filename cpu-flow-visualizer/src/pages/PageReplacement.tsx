import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Play, RefreshCw, Layers, Pause } from "lucide-react";
import { PageReplacementAlgorithmType, PageReference } from "@/types/pageReplacement";
import { runPageReplacementAlgorithm } from "@/utils/pageReplacementAlgorithms";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const PageReplacement = () => {
  const [references, setReferences] = useState<PageReference[]>([]);
  const [frameCount, setFrameCount] = useState<number>(3);
  const [referenceInput, setReferenceInput] = useState<string>("");
  const [algorithm, setAlgorithm] = useState<PageReplacementAlgorithmType>("fifo");
  const [result, setResult] = useState<any>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("input");
  const [animationSpeed, setAnimationSpeed] = useState<number>(500); // ms per step

  // Generate random sequence
  const generateRandomSequence = () => {
    const count = Math.floor(Math.random() * 10) + 10; // 10-20 references
    const maxValue = 9; // Pages 0-9
    const newReferences: PageReference[] = [];
    
    for (let i = 0; i < count; i++) {
      const value = Math.floor(Math.random() * (maxValue + 1));
      newReferences.push({
        id: `ref-${i}`,
        value
      });
    }
    
    setReferences(newReferences);
    setReferenceInput(newReferences.map(ref => ref.value).join(" "));
  };

  // Parse reference input
  const parseReferenceInput = () => {
    try {
      // Split by spaces and convert to numbers
      const values = referenceInput
        .split(/[\s,]+/)
        .map(val => val.trim())
        .filter(val => val !== "")
        .map(val => parseInt(val, 10));
      
      // Validate all values are numbers
      if (values.some(isNaN)) {
        toast({
          title: "Invalid input",
          description: "Please enter valid numbers separated by spaces",
          variant: "destructive"
        });
        return false;
      }

      // Create reference objects
      const newReferences = values.map((val, index) => ({
        id: `ref-${index}`,
        value: val
      }));

      setReferences(newReferences);
      return true;
    } catch (error) {
      toast({
        title: "Error parsing input",
        description: "Please check your input format",
        variant: "destructive"
      });
      return false;
    }
  };

  // Run simulation
  const runSimulation = () => {
    if (!parseReferenceInput()) return;
    
    if (frameCount < 1) {
      toast({
        title: "Invalid frame count",
        description: "Number of frames must be at least 1",
        variant: "destructive"
      });
      return;
    }

    const simulationResult = runPageReplacementAlgorithm(references, frameCount, algorithm);
    setResult(simulationResult);
    setCurrentStep(0);
    // Automatically switch to visualization tab after running simulation
    setActiveTab("visualization");
  };

  // Animate the simulation
  const animateSimulation = () => {
    if (!result) return;
    
    setIsAnimating(prev => !prev); // Toggle animation state
  };

  // Effect to handle animation
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (isAnimating && result) {
      timer = setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          if (next >= result.frames.length) {
            setIsAnimating(false);
            return result.frames.length - 1;
          }
          return next;
        });
      }, animationSpeed);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAnimating, result, animationSpeed]);

  return (
    <>
      <AppSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Page Replacement</h1>
            <p className="text-muted-foreground mt-1">
              Visualize page replacement algorithms like FIFO, LRU, OPT and more
            </p>
          </div>
          <SidebarTrigger>
            <Button variant="outline" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </SidebarTrigger>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="input">Input</TabsTrigger>
                <TabsTrigger value="visualization">Visualization</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="input" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="algorithm">Algorithm</Label>
                      <select 
                        id="algorithm"
                        className="w-full p-2 border rounded-md"
                        value={algorithm}
                        onChange={(e) => setAlgorithm(e.target.value as PageReplacementAlgorithmType)}
                      >
                        <option value="fifo">First In First Out (FIFO)</option>
                        <option value="lru">Least Recently Used (LRU)</option>
                        <option value="opt" disabled>Optimal (OPT)</option>
                        <option value="mru" disabled>Most Recently Used (MRU)</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="frameCount">Number of Frames</Label>
                      <Input 
                        id="frameCount"
                        type="number" 
                        min="1"
                        value={frameCount}
                        onChange={(e) => setFrameCount(parseInt(e.target.value) || 1)}
                      />
                    </div>
                    
                    <Button variant="outline" onClick={generateRandomSequence}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate Random Sequence
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="references">Page Reference Sequence</Label>
                      <textarea 
                        id="references"
                        className="w-full h-32 p-2 border rounded-md font-mono"
                        placeholder="Enter page numbers separated by spaces (e.g., 1 2 3 4 1 2 5 1 2 3 4 5)"
                        value={referenceInput}
                        onChange={(e) => setReferenceInput(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Enter page numbers separated by spaces (e.g., 1 2 3 4 1 2 5 1 2 3 4 5)
                      </p>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button onClick={runSimulation}>
                        Run Simulation
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="visualization" className="min-h-[400px]">
                {result ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">
                        Page Replacement Visualization (Step {currentStep + 1} of {result.frames.length})
                      </h3>
                      <div className="flex gap-2 items-center">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="speed" className="text-sm">Speed:</Label>
                          <select 
                            id="speed"
                            className="px-2 py-1 border rounded-md text-sm"
                            value={animationSpeed}
                            onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                            disabled={isAnimating}
                          >
                            <option value="1000">Slow</option>
                            <option value="500">Medium</option>
                            <option value="200">Fast</option>
                          </select>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentStep === 0}
                          onClick={() => setCurrentStep(0)}
                        >
                          First
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentStep === 0 || isAnimating}
                          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                        >
                          Previous
                        </Button>
                        <Button
                          variant={isAnimating ? "secondary" : "outline"}
                          size="sm"
                          onClick={animateSimulation}
                          disabled={!result}
                        >
                          {isAnimating ? (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Play
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentStep >= result.frames.length - 1 || isAnimating}
                          onClick={() => setCurrentStep(prev => Math.min(result.frames.length - 1, prev + 1))}
                        >
                          Next
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentStep >= result.frames.length - 1}
                          onClick={() => setCurrentStep(result.frames.length - 1)}
                        >
                          Last
                        </Button>
                      </div>
                    </div>

                    {/* Reference Sequence */}
                    <ScrollArea className="w-full border rounded-md p-4">
                      <h4 className="text-sm font-medium mb-2">Reference Sequence</h4>
                      <div className="flex gap-2 pb-2 min-w-max">
                        {references.map((ref, index) => (
                          <div 
                            key={ref.id}
                            className={`
                              w-10 h-10 flex items-center justify-center rounded-md font-mono
                              ${index === currentStep ? 'bg-primary text-primary-foreground ring-2 ring-offset-2 ring-primary' : 'bg-muted'}
                            `}
                          >
                            {ref.value}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    {/* Frames Visualization */}
                    <div className="border rounded-md p-4">
                      <h4 className="text-sm font-medium mb-2">Memory Frames</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {result.frames[currentStep]?.map((frame: any, frameIndex: number) => (
                          <div 
                            key={frame.id}
                            className={`
                              border p-3 rounded-md flex items-center
                              ${frame.isNewlyLoaded ? 'bg-amber-100 dark:bg-amber-950 animate-pulse' : ''}
                              ${frame.isHit ? 'bg-green-100 dark:bg-green-950' : ''}
                            `}
                          >
                            <div className="w-10 h-10 flex items-center justify-center rounded-md bg-muted mr-3 font-mono">
                              {frameIndex}
                            </div>
                            <div className="flex-1">
                              <div className="text-lg font-mono">
                                {frame.value !== null ? frame.value : '-'}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              {frame.isNewlyLoaded && (
                                <span className="px-2 py-1 bg-amber-200 dark:bg-amber-900 text-xs rounded">
                                  Loaded
                                </span>
                              )}
                              {frame.isHit && (
                                <span className="px-2 py-1 bg-green-200 dark:bg-green-900 text-xs rounded">
                                  Hit
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px]">
                    <Layers className="h-16 w-16 text-muted-foreground/50" />
                    <h3 className="mt-4 text-xl font-medium">No simulation results</h3>
                    <p className="text-muted-foreground mt-1">
                      Configure and run a simulation to see the visualization
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="stats">
                {result ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-4">
                      <h3 className="text-lg font-medium mb-4">Performance Metrics</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 border-b pb-2">
                          <span className="font-medium">Page Hits:</span>
                          <span>{result.hits}</span>
                        </div>
                        <div className="grid grid-cols-2 border-b pb-2">
                          <span className="font-medium">Page Faults:</span>
                          <span>{result.faults}</span>
                        </div>
                        <div className="grid grid-cols-2 border-b pb-2">
                          <span className="font-medium">Total References:</span>
                          <span>{references.length}</span>
                        </div>
                        <div className="grid grid-cols-2 border-b pb-2">
                          <span className="font-medium">Hit Ratio:</span>
                          <span>{result.hitRatio.toFixed(2)}%</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="font-medium">Fault Rate:</span>
                          <span>{(100 - result.hitRatio).toFixed(2)}%</span>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <h3 className="text-lg font-medium mb-4">Algorithm Details</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 border-b pb-2">
                          <span className="font-medium">Algorithm:</span>
                          <span>
                            {algorithm === 'fifo' ? 'First In First Out (FIFO)' : 
                             algorithm === 'lru' ? 'Least Recently Used (LRU)' : 
                             algorithm === 'opt' ? 'Optimal (OPT)' : 'Most Recently Used (MRU)'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 border-b pb-2">
                          <span className="font-medium">Frame Count:</span>
                          <span>{frameCount}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="font-medium">Reference String Length:</span>
                          <span>{references.length}</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px]">
                    <Layers className="h-16 w-16 text-muted-foreground/50" />
                    <h3 className="mt-4 text-xl font-medium">No statistics available</h3>
                    <p className="text-muted-foreground mt-1">
                      Run a simulation to see performance metrics
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PageReplacement;

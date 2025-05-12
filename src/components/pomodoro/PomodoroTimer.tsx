
import { useState, useEffect } from "react";
import { Clock, PlayCircle, PauseCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

const TIMER_CONFIG = {
  pomodoro: 25 * 60, // 25 minutes in seconds
  shortBreak: 5 * 60, // 5 minutes in seconds
  longBreak: 15 * 60, // 15 minutes in seconds
};

export function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(TIMER_CONFIG[mode]);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);
  
  const percentage = Math.round((timeLeft / TIMER_CONFIG[mode]) * 100);

  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Reset timer when mode changes
  useEffect(() => {
    setTimeLeft(TIMER_CONFIG[mode]);
    setIsActive(false);
  }, [mode]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      
      // Play sound
      const audio = new Audio('/notification.mp3');
      audio.play().catch(error => console.log('Audio play failed:', error));
      
      // Handle cycle completion
      if (mode === 'pomodoro') {
        const newCycles = cycles + 1;
        setCycles(newCycles);
        
        // After every 4 pomodoros, take a long break
        if (newCycles % 4 === 0) {
          setMode('longBreak');
        } else {
          setMode('shortBreak');
        }
      } else {
        setMode('pomodoro');
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, cycles]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setTimeLeft(TIMER_CONFIG[mode]);
    setIsActive(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          Pomodoro Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={mode} onValueChange={(v) => setMode(v as TimerMode)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pomodoro">Focus</TabsTrigger>
            <TabsTrigger value="shortBreak">Short Break</TabsTrigger>
            <TabsTrigger value="longBreak">Long Break</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center mb-4">
            <svg className="w-48 h-48">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                className="text-muted/20"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="553"
                strokeDashoffset={553 - (553 * percentage) / 100}
                className="text-primary"
                transform="rotate(-90 96 96)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>
          
          <div className="flex justify-center gap-4 mt-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleTimer}
              className="h-12 w-12 rounded-full"
            >
              {isActive ? <PauseCircle className="h-6 w-6" /> : <PlayCircle className="h-6 w-6" />}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={resetTimer}
              className="h-12 w-12 rounded-full"
            >
              <RefreshCw className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Completed cycles: {cycles}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

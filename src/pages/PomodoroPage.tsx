
import AppLayout from "@/components/layout/AppLayout";
import { PomodoroTimer } from "@/components/pomodoro/PomodoroTimer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, Info } from "lucide-react";

const PomodoroPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Pomodoro Timer</h1>
          <p className="text-muted-foreground">
            Stay focused with timed study sessions
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PomodoroTimer />
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  How to use the Pomodoro Technique
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Choose a task you want to accomplish</li>
                  <li>Set the timer for 25 minutes (focus session)</li>
                  <li>Work on the task until the timer rings</li>
                  <li>Take a short break (5 minutes)</li>
                  <li>After 4 pomodoros, take a longer break (15-30 minutes)</li>
                </ol>
                
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    Research shows that the Pomodoro Technique can help improve focus and productivity by breaking work into manageable intervals.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PomodoroPage;

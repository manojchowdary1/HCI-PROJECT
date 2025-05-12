
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Book, Calendar, Clock, CheckCircle } from "lucide-react";

interface SubjectCardProps {
  name: string;
  progress: number;
  examDate: string;
  timeLeft: string;
  completedTasks?: number;
  totalTasks?: number;
}

export function SubjectCard({ 
  name, 
  progress, 
  examDate, 
  timeLeft,
  completedTasks = 0,
  totalTasks = 0
}: SubjectCardProps) {
  return (
    <Card className="w-full overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" />
            <span>{name}</span>
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {progress}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-4">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{examDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{timeLeft}</span>
          </div>
        </div>
        {totalTasks > 0 && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>
              {completedTasks} of {totalTasks} tasks completed
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, Check, Trash } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { StudyTask, completeStudyTask, deleteStudyTask } from "@/services/studyTaskService";
import { useToast } from "@/components/ui/use-toast";

interface StudyCalendarProps {
  tasks: StudyTask[];
  onTasksChanged: () => void;
}

export function StudyCalendar({ tasks, onTasksChanged }: StudyCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  
  const tasksForSelectedDate = tasks.filter(task => 
    selectedDate && isSameDay(new Date(task.date), selectedDate)
  );
  
  // Add custom styling for dates with tasks
  const daysWithTasks = tasks.map(task => new Date(task.date));
  
  const handleMarkAsCompleted = async (taskId: string) => {
    try {
      const success = await completeStudyTask(taskId);
      if (success) {
        toast({
          title: "Task completed!",
          description: "The task has been marked as completed.",
        });
        onTasksChanged(); // Refresh tasks
      } else {
        toast({
          title: "Error",
          description: "Failed to mark task as completed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error completing task:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteTask = async (taskId: string) => {
    try {
      const success = await deleteStudyTask(taskId);
      if (success) {
        toast({
          title: "Task deleted",
          description: "The task has been removed from your plan.",
        });
        onTasksChanged(); // Refresh tasks
      } else {
        toast({
          title: "Error",
          description: "Failed to delete task. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          Study Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 pb-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          modifiers={{
            booked: daysWithTasks,
          }}
          modifiersStyles={{
            booked: {
              fontWeight: "bold",
              backgroundColor: "hsl(var(--primary) / 0.1)",
              color: "hsl(var(--primary))",
            }
          }}
        />
        
        <div className="flex-1 flex flex-col mt-4">
          <h3 className="font-medium mb-2">
            {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
          </h3>
          
          <ScrollArea className="flex-1 border rounded-md">
            <div className="p-4">
              {tasksForSelectedDate.length > 0 ? (
                <div className="space-y-3">
                  {tasksForSelectedDate.map((task) => (
                    <div 
                      key={task.id}
                      className={`p-3 border rounded-md ${
                        task.completed 
                          ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30" 
                          : "bg-card"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge variant={task.completed ? "success" : "outline"} className="mb-2">
                            {task.subject.charAt(0).toUpperCase() + task.subject.slice(1)}
                            {task.completed && " ✓"}
                          </Badge>
                          <h4 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                            {task.topic}
                          </h4>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{task.duration} min</span>
                        </div>
                      </div>
                      
                      {!task.completed && (
                        <div className="flex justify-end gap-2 mt-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                            onClick={() => handleMarkAsCompleted(task.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No study tasks scheduled for this day.
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}

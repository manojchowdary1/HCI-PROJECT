
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  ChartContainer
} from "@/components/ui/chart";
import { BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from "recharts";
import { StudyTask, fetchStudyTasks, loadTasksFromLocalStorage } from "@/services/studyTaskService";
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

// Define our own BarChartProps type
interface BarChartProps {
  data: Array<{
    name: string;
    study: number;
    target: number;
    [key: string]: string | number;
  }>;
  categories: string[];
  colors: string[];
  yAxisWidth?: number;
  showAnimation?: boolean;
  showLegend?: boolean;
  className?: string;
}

// Create a custom BarChart component using ChartContainer
const BarChart = ({
  data,
  categories,
  colors,
  yAxisWidth = 30,
  showAnimation = false,
  showLegend = false,
  className,
}: BarChartProps) => {
  const config = categories.reduce((acc, category, index) => {
    acc[category] = { 
      color: colors[index % colors.length] || 'violet'
    };
    return acc;
  }, {} as Record<string, { color: string }>);

  return (
    <ChartContainer className={className} config={config}>
      <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <defs>
          {categories.map((category, index) => (
            <linearGradient key={category} id={`color-${category}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors[index % colors.length] || 'violet'} stopOpacity={0.8} />
              <stop offset="100%" stopColor={colors[index % colors.length] || 'violet'} stopOpacity={0.3} />
            </linearGradient>
          ))}
        </defs>
        <XAxis dataKey="name" />
        <YAxis width={yAxisWidth} />
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <Tooltip />
        {showLegend && <Legend />}
        {categories.map((category, index) => (
          <Bar
            key={category}
            dataKey={category}
            fill={`url(#color-${category})`}
            animationDuration={showAnimation ? 1500 : 0}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
};

interface SubjectProgress {
  name: string;
  completed: number;
  total: number;
  percentage: number;
  change: number;
}

export function ProgressTracking() {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const { toast } = useToast();

  // Fetch study tasks
  useEffect(() => {
    const getTasks = async () => {
      setLoading(true);
      try {
        // Try to get tasks from Supabase or local storage
        let fetchedTasks = await fetchStudyTasks();
        
        if (!fetchedTasks.length) {
          fetchedTasks = loadTasksFromLocalStorage();
        }
        
        setTasks(fetchedTasks);
        processTasksData(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast({
          title: "Error loading data",
          description: "Failed to load your progress data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    getTasks();
  }, [toast]);
  
  const processTasksData = (tasks: StudyTask[]) => {
    // Group tasks by subject
    const subjectGroups = tasks.reduce((groups, task) => {
      const normalizedSubject = task.subject.toLowerCase();
      
      if (!groups[normalizedSubject]) {
        groups[normalizedSubject] = {
          name: task.subject.charAt(0).toUpperCase() + task.subject.slice(1),
          completed: 0,
          total: 0,
          lastMonth: 0,
        };
      }
      
      groups[normalizedSubject].total++;
      
      if (task.completed) {
        groups[normalizedSubject].completed++;
        
        // Check if completed in the last month
        const lastMonth = subDays(new Date(), 30);
        if (task.completed_date && task.completed_date >= lastMonth) {
          groups[normalizedSubject].lastMonth++;
        }
      }
      
      return groups;
    }, {} as Record<string, { name: string; completed: number; total: number; lastMonth: number }>);
    
    // Convert to array and calculate percentages
    const progressData = Object.values(subjectGroups).map(subject => {
      const previousPercentage = subject.total > 0 
        ? ((subject.completed - subject.lastMonth) / subject.total) * 100 
        : 0;
      
      const currentPercentage = subject.total > 0 
        ? (subject.completed / subject.total) * 100 
        : 0;
      
      const change = currentPercentage - previousPercentage;
      
      return {
        name: subject.name,
        completed: subject.completed,
        total: subject.total,
        percentage: Math.round(currentPercentage),
        change: Math.round(change),
      };
    });
    
    // Sort by percentage descending
    progressData.sort((a, b) => b.percentage - a.percentage);
    
    setSubjectProgress(progressData);
    
    // Generate weekly data for the chart
    generateWeeklyData(tasks);
  };
  
  const generateWeeklyData = (tasks: StudyTask[]) => {
    // Get current week
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
    const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });
    
    // Get previous weeks
    const startOfPreviousWeek = startOfWeek(subDays(today, 7), { weekStartsOn: 1 });
    const startOfTwoWeeksAgo = startOfWeek(subDays(today, 14), { weekStartsOn: 1 });
    const startOfThreeWeeksAgo = startOfWeek(subDays(today, 21), { weekStartsOn: 1 });
    const startOfFourWeeksAgo = startOfWeek(subDays(today, 28), { weekStartsOn: 1 });
    const startOfFiveWeeksAgo = startOfWeek(subDays(today, 35), { weekStartsOn: 1 });
    
    // Group weeks
    const weeks = [
      { 
        start: startOfFiveWeeksAgo, 
        end: addWeeks(startOfFiveWeeksAgo, 1), 
        name: "Week 1" 
      },
      { 
        start: startOfFourWeeksAgo, 
        end: addWeeks(startOfFourWeeksAgo, 1), 
        name: "Week 2" 
      },
      { 
        start: startOfThreeWeeksAgo, 
        end: addWeeks(startOfThreeWeeksAgo, 1), 
        name: "Week 3" 
      },
      { 
        start: startOfTwoWeeksAgo, 
        end: addWeeks(startOfTwoWeeksAgo, 1), 
        name: "Week 4" 
      },
      { 
        start: startOfPreviousWeek, 
        end: addWeeks(startOfPreviousWeek, 1), 
        name: "Week 5" 
      },
      { 
        start: startOfCurrentWeek, 
        end: endOfCurrentWeek, 
        name: "Week 6" 
      },
    ];
    
    // Count completed tasks per week
    const weeklyData = weeks.map(week => {
      // Count study hours (completed tasks within this week)
      const completedInWeek = tasks.filter(task => 
        task.completed && 
        task.completed_date && 
        task.completed_date >= week.start && 
        task.completed_date <= week.end
      );
      
      // Convert duration to hours
      const studyHours = completedInWeek.reduce((total, task) => {
        const minutes = parseInt(task.duration, 10) || 0;
        return total + (minutes / 60);
      }, 0);
      
      return {
        name: week.name,
        study: Math.round(studyHours * 10) / 10, // Round to 1 decimal place
        target: 10, // Target 10 hours per week
      };
    });
    
    setWeeklyData(weeklyData);
  };

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            // Loading state
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="h-6 w-24 bg-muted animate-pulse rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 bg-muted animate-pulse rounded mb-1"></div>
                  <div className="h-4 w-32 bg-muted animate-pulse rounded mb-4"></div>
                  <div className="h-2 w-full bg-muted animate-pulse rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : subjectProgress.length > 0 ? (
            // Show top 3 subjects or all if less than 3
            subjectProgress.slice(0, 3).map((subject, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle>{subject.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{subject.percentage}%</div>
                  <p className="text-xs text-muted-foreground">
                    {subject.change > 0 ? '+' : ''}{subject.change}% from last month
                  </p>
                  <div className="mt-4 h-1">
                    <Progress value={subject.percentage} className="h-2" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {subject.completed} of {subject.total} tasks completed
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            // No data state
            <Card className="col-span-full">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  You don't have any study tasks yet. 
                  Add some tasks in the Study Planner to track your progress.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="analytics">
        <Card>
          <CardHeader>
            <CardTitle>Study Hours Analytics</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <BarChart
              data={weeklyData}
              categories={["study", "target"]}
              colors={["violet", "neutral"]}
              yAxisWidth={30}
              showAnimation
              showLegend
              className="h-80"
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

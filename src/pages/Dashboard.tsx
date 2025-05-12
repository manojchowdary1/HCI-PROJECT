
import { useEffect, useState } from "react";
import { format, isAfter, isBefore, addDays, isToday, isTomorrow } from "date-fns";
import AppLayout from "@/components/layout/AppLayout";
import { SubjectCard } from "@/components/dashboard/SubjectCard";
import { UpcomingCard } from "@/components/dashboard/UpcomingCard";
import { DailyQuote } from "@/components/dashboard/DailyQuote";
import { StudyTask, fetchStudyTasks, loadTasksFromLocalStorage } from "@/services/studyTaskService";
import { supabase } from "@/integrations/supabase/client";

interface SubjectProgress {
  id: string;
  name: string;
  progress: number;
  examDate: string;
  timeLeft: string;
  completedTasks: number;
  totalTasks: number;
}

const subjects = [
  { 
    id: "1", 
    name: "Mathematics", 
    examDate: "Jun 15, 2023",
    timeLeft: "4 weeks" 
  },
  { 
    id: "2", 
    name: "Computer Science", 
    examDate: "Jun 22, 2023",
    timeLeft: "5 weeks" 
  },
  { 
    id: "3", 
    name: "History", 
    examDate: "Jun 10, 2023",
    timeLeft: "3 weeks" 
  },
  { 
    id: "4", 
    name: "Literature", 
    examDate: "Jun 18, 2023",
    timeLeft: "4 weeks" 
  },
];

const Dashboard = () => {
  const [greeting, setGreeting] = useState("");
  const [upcomingTasks, setUpcomingTasks] = useState<{
    title: string;
    subject: string;
    dueDate: string;
  }[]>([]);
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([]);
  const [user, setUser] = useState<any>(null);

  // Check for user authentication
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    
    fetchUser();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  // Fetch study tasks and filter for upcoming ones
  useEffect(() => {
    const getTasksData = async () => {
      let tasks: StudyTask[] = [];
      
      try {
        // Try to get tasks from Supabase if authenticated
        if (user) {
          tasks = await fetchStudyTasks();
        }
        
        // Fall back to localStorage if needed
        if (!tasks.length) {
          tasks = loadTasksFromLocalStorage();
        }
        
        // Process tasks for upcoming and progress
        processTasksData(tasks);
      } catch (error) {
        console.error("Error fetching tasks data:", error);
      }
    };
    
    getTasksData();
  }, [user]);
  
  const processTasksData = (tasks: StudyTask[]) => {
    // Filter to get only upcoming tasks (today + next 3 days)
    const today = new Date();
    const nextThreeDays = addDays(today, 3);
    
    // Filter for upcoming, non-completed tasks
    const upcoming = tasks
      .filter(task => 
        !task.completed && 
        isAfter(task.date, new Date(today.setHours(0, 0, 0, 0))) &&
        isBefore(task.date, nextThreeDays)
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5) // Limit to 5 tasks
      .map(task => {
        let dueDate = "Soon";
        
        if (isToday(task.date)) {
          dueDate = "Today";
        } else if (isTomorrow(task.date)) {
          dueDate = "Tomorrow";
        } else {
          dueDate = `In ${format(task.date, "d")} days`;
        }
        
        return {
          title: task.topic,
          subject: task.subject.charAt(0).toUpperCase() + task.subject.slice(1),
          dueDate
        };
      });
      
    setUpcomingTasks(upcoming);
    
    // Calculate progress for each subject
    const subjectStats: Record<string, { completed: number, total: number }> = {};
    
    // First, initialize with all known subjects
    subjects.forEach(subj => {
      const normalizedName = subj.name.toLowerCase();
      subjectStats[normalizedName] = { completed: 0, total: 0 };
    });
    
    // Count tasks per subject
    tasks.forEach(task => {
      const normalizedSubject = task.subject.toLowerCase();
      
      if (!subjectStats[normalizedSubject]) {
        subjectStats[normalizedSubject] = { completed: 0, total: 0 };
      }
      
      subjectStats[normalizedSubject].total += 1;
      
      if (task.completed) {
        subjectStats[normalizedSubject].completed += 1;
      }
    });
    
    // Calculate progress percentage for each subject
    const progressData = subjects.map(subj => {
      const normalizedName = subj.name.toLowerCase();
      const stats = subjectStats[normalizedName] || { completed: 0, total: 0 };
      
      // Calculate percentage, handle case where total is 0
      const progressPercentage = stats.total > 0 
        ? Math.round((stats.completed / stats.total) * 100) 
        : 0;
      
      return {
        ...subj,
        progress: progressPercentage,
        completedTasks: stats.completed,
        totalTasks: stats.total
      };
    });
    
    setSubjectProgress(progressData);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">{greeting}</h1>
          <p className="text-muted-foreground">Here's your study overview</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjectProgress.map((subject) => (
            <SubjectCard
              key={subject.id}
              name={subject.name}
              progress={subject.progress}
              examDate={subject.examDate}
              timeLeft={subject.timeLeft}
              completedTasks={subject.completedTasks}
              totalTasks={subject.totalTasks}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UpcomingCard tasks={upcomingTasks} />
          </div>
          <div>
            <DailyQuote />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;

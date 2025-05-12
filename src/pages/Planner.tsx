
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { StudyPlanForm } from "@/components/planner/StudyPlanForm";
import { StudyCalendar } from "@/components/planner/StudyCalendar";
import { fetchStudyTasks, addStudyTask, saveTasksToLocalStorage, loadTasksFromLocalStorage, StudyTask } from "@/services/studyTaskService";
import { supabase } from "@/integrations/supabase/client";

const Planner = () => {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  
  // Check authentication and load user
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
  
  // Load tasks from Supabase or localStorage as fallback
  const loadTasks = async () => {
    setLoading(true);
    try {
      // If user is authenticated, try to load from Supabase
      if (user) {
        const supabaseTasks = await fetchStudyTasks();
        if (supabaseTasks && supabaseTasks.length > 0) {
          setTasks(supabaseTasks);
          // Update localStorage with latest data
          saveTasksToLocalStorage(supabaseTasks);
          setLoading(false);
          return;
        }
      }
      
      // Fallback to localStorage if not authenticated or no Supabase data
      const localTasks = loadTasksFromLocalStorage();
      setTasks(localTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast({
        title: "Error loading tasks",
        description: "There was a problem loading your study tasks.",
        variant: "destructive",
      });
      
      // Last resort fallback to empty array
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Load tasks when user changes
  useEffect(() => {
    loadTasks();
  }, [user, toast]);
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      saveTasksToLocalStorage(tasks);
    }
  }, [tasks, loading]);
  
  const handleAddTask = async (task: StudyTask) => {
    try {
      if (user) {
        // If authenticated, save to Supabase
        const newTask = await addStudyTask({
          ...task,
          user_id: user.id,
        });
        
        if (newTask) {
          await loadTasks(); // Reload all tasks to ensure consistency
          toast({
            title: "Task added",
            description: "Your study task has been saved to your account.",
          });
          return;
        }
      }
      
      // Fallback to just using localStorage if not authenticated or Supabase fails
      setTasks([...tasks, task]);
      toast({
        title: "Task added",
        description: "Your study task has been added to your local plan.",
      });
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Error adding task",
        description: "There was a problem saving your study task.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Study Planner</h1>
          <p className="text-muted-foreground">Create and manage your study schedule</p>
          
          {!user && (
            <div className="mt-2 p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-md">
              <p className="text-sm">
                Sign in to save your study plans to your account and access them from any device.
              </p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StudyPlanForm onAddTask={handleAddTask} />
          <StudyCalendar tasks={tasks} onTasksChanged={loadTasks} />
        </div>
      </div>
    </AppLayout>
  );
};

export default Planner;

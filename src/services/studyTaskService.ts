
import { supabase } from "@/integrations/supabase/client";

export interface StudyTask {
  id: string;
  subject: string;
  topic: string;
  date: Date;
  duration: string;
  user_id?: string;
  completed?: boolean;
  completed_date?: Date | null;
}

// Fetch tasks from Supabase
export const fetchStudyTasks = async (): Promise<StudyTask[]> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('No authenticated user, loading from localStorage');
      return loadTasksFromLocalStorage();
    }
    
    const { data, error } = await supabase
      .from('study_tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true });
      
    if (error) {
      console.error('Error fetching study tasks:', error);
      return loadTasksFromLocalStorage();
    }
    
    // Convert string dates to Date objects
    return data.map((task: any) => ({
      ...task,
      date: new Date(task.date),
      completed_date: task.completed_date ? new Date(task.completed_date) : null,
    }));
  } catch (error) {
    console.error('Error in fetchStudyTasks:', error);
    return loadTasksFromLocalStorage();
  }
};

// Add a new task to Supabase
export const addStudyTask = async (task: Omit<StudyTask, 'id'>): Promise<StudyTask | null> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Format the date for PostgreSQL compatibility
    const formattedTask = {
      ...task,
      date: task.date.toISOString(),
      user_id: user?.id || null,
      completed: false
    };
    
    // If user is not authenticated, save to localStorage only
    if (!user) {
      const tasks = loadTasksFromLocalStorage();
      const newTask: StudyTask = {
        ...task,
        id: crypto.randomUUID(),
        completed: false,
        completed_date: null
      };
      saveTasksToLocalStorage([...tasks, newTask]);
      return newTask;
    }
    
    const { data, error } = await supabase
      .from('study_tasks')
      .insert([formattedTask])
      .select()
      .single();
      
    if (error) {
      console.error('Error adding study task:', error);
      
      // Fallback to localStorage
      const tasks = loadTasksFromLocalStorage();
      const newTask: StudyTask = {
        ...task,
        id: crypto.randomUUID(),
        completed: false,
        completed_date: null
      };
      saveTasksToLocalStorage([...tasks, newTask]);
      return newTask;
    }
    
    // Convert back to our format
    return {
      ...data,
      date: new Date(data.date),
      completed_date: data.completed_date ? new Date(data.completed_date) : null,
    };
  } catch (error) {
    console.error('Error in addStudyTask:', error);
    
    // Fallback to localStorage
    const tasks = loadTasksFromLocalStorage();
    const newTask: StudyTask = {
      ...task,
      id: crypto.randomUUID(),
      completed: false,
      completed_date: null
    };
    saveTasksToLocalStorage([...tasks, newTask]);
    return newTask;
  }
};

// Mark a task as completed
export const completeStudyTask = async (id: string): Promise<boolean> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // If user is not authenticated, update in localStorage only
    if (!user) {
      const tasks = loadTasksFromLocalStorage();
      const updatedTasks = tasks.map(task => 
        task.id === id 
          ? { ...task, completed: true, completed_date: new Date() } 
          : task
      );
      saveTasksToLocalStorage(updatedTasks);
      return true;
    }
    
    const now = new Date().toISOString();
    
    const { error } = await supabase
      .from('study_tasks')
      .update({ 
        completed: true, 
        completed_date: now 
      })
      .eq('id', id)
      .eq('user_id', user.id);
      
    if (error) {
      console.error('Error completing study task:', error);
      
      // Fallback to localStorage
      const tasks = loadTasksFromLocalStorage();
      const updatedTasks = tasks.map(task => 
        task.id === id 
          ? { ...task, completed: true, completed_date: new Date() } 
          : task
      );
      saveTasksToLocalStorage(updatedTasks);
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error in completeStudyTask:', error);
    return false;
  }
};

// Delete a task from Supabase
export const deleteStudyTask = async (id: string): Promise<boolean> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // If user is not authenticated, delete from localStorage only
    if (!user) {
      const tasks = loadTasksFromLocalStorage();
      const updatedTasks = tasks.filter(task => task.id !== id);
      saveTasksToLocalStorage(updatedTasks);
      return true;
    }
    
    const { error } = await supabase
      .from('study_tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
      
    if (error) {
      console.error('Error deleting study task:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteStudyTask:', error);
    return false;
  }
};

// Add or update tasks in local storage as fallback
export const saveTasksToLocalStorage = (tasks: StudyTask[]) => {
  localStorage.setItem('studyTasks', JSON.stringify(tasks));
};

// Load tasks from local storage as fallback
export const loadTasksFromLocalStorage = (): StudyTask[] => {
  const savedTasks = localStorage.getItem('studyTasks');
  if (savedTasks) {
    try {
      return JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        date: new Date(task.date),
        completed_date: task.completed_date ? new Date(task.completed_date) : null,
        completed: task.completed || false
      }));
    } catch (error) {
      console.error("Failed to parse saved tasks:", error);
      return [];
    }
  }
  return [];
};

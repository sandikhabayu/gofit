import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { workoutStorage } from '@/utils/storage';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  notes?: string;
}

interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  createdAt: string;
  completed: boolean;
}

// Custom hook for managing workout data with local storage
export function useWorkoutData() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [scheduledWorkouts, setScheduledWorkouts] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [workoutStats, setWorkoutStats] = useState<any>(null);
  const [todayWorkout, setTodayWorkout] = useState<any>(null);
  const [todayExercises, setTodayExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all data on component mount
  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const stored = await AsyncStorage.getItem('workouts');
        if (stored) {
          setWorkouts(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading workouts:', error);
      } finally {
        setLoading(false);
      }
    };
    loadWorkouts();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [
        savedWorkouts,
        savedExercises,
        savedScheduled,
        savedActivities,
        savedProfile,
        savedStats,
      ] = await Promise.all([
        workoutStorage.getWorkouts(),
        workoutStorage.getExercises(),
        workoutStorage.getScheduledWorkouts(),
        workoutStorage.getActivities(),
        workoutStorage.getUserProfile(),
        workoutStorage.getWorkoutStats(),
      ]);

      setWorkouts(savedWorkouts);
      setExercises(savedExercises);
      setScheduledWorkouts(savedScheduled);
      setActivities(savedActivities);
      setUserProfile(savedProfile);
      setWorkoutStats(savedStats);
      
      // Load today's data
      loadTodayData(savedWorkouts, savedExercises, savedActivities);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTodayData = (workouts: any[], exercises: any[], activities: any[]) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Get today's workout
    const todaysWorkout = workouts.find(w => w.date === today && !w.completed);
    setTodayWorkout(todaysWorkout);
    
    // Get today's exercises
    const todaysExercises = exercises.filter(e => e.date === today);
    setTodayExercises(todaysExercises);
  };

  // Workout functions
  const addWorkout = async (newWorkout: Workout) => {
    try {
      const updated = [...workouts, newWorkout];
      await AsyncStorage.setItem('workouts', JSON.stringify(updated));
      // Perbarui todayWorkout jika workout baru adalah untuk hari ini
    const today = new Date().toISOString().split('T')[0];
    if (newWorkout.date === today) {
      setTodayWorkout(newWorkout);
    }
    return newWorkout;
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  };

  const updateWorkout = async (workoutId: string, updates: any) => {
    try {
      const updatedWorkouts = workouts.map(workout =>
        workout.id === workoutId ? { ...workout, ...updates } : workout
      );
      
      setWorkouts(updatedWorkouts);
      await workoutStorage.saveWorkouts(updatedWorkouts);
      
      // Update today's workout if it's the one being updated
      if (todayWorkout && todayWorkout.id === workoutId) {
        setTodayWorkout({ ...todayWorkout, ...updates });
      }
    } catch (error) {
      console.error('Error updating workout:', error);
      throw error;
    }
  };

  const deleteWorkout = async (id: string) => {
    try {
      const updated = workouts.filter(w => w.id !== id);
      await AsyncStorage.setItem('workouts', JSON.stringify(updated));
      setWorkouts(updated);
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  // Exercise functions
  const addExercise = async (exercise: any) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const newExercise = {
        ...exercise,
        id: Date.now().toString(),
        date: today,
        createdAt: new Date().toISOString(),
        completed: false, // Pastikan status awal diatur
      };
      
      const existingExercises = await workoutStorage.getExercises();
      const updatedExercises = [...existingExercises, newExercise];
      await workoutStorage.saveExercises(updatedExercises);
      
      if (newExercise.date === today) {
      setTodayExercises(prev => [...prev, newExercise]);
    }
      await loadAllData();
      
      return newExercise;
    } catch (error) {
      console.error('Error adding exercise:', error);
      throw error;
    }
  };

  const updateExercise = async (exerciseId: string, updates: any) => {
    try {
      const updatedExercises = exercises.map(exercise =>
        exercise.id === exerciseId ? { ...exercise, ...updates } : exercise
      );
      
      setExercises(updatedExercises);
      await workoutStorage.saveExercises(updatedExercises);
      
      // Update today's exercises if it was updated
      const today = new Date().toISOString().split('T')[0];
      const todaysExercises = updatedExercises.filter(e => e.date === today);
      setTodayExercises(todaysExercises);
    } catch (error) {
      console.error('Error updating exercise:', error);
      throw error;
    }
  };

  // Edit exercise function
  const editExercise = async (exerciseId: string, updates: any) => {
    try {
      const updatedExercises = exercises.map(exercise =>
        exercise.id === exerciseId ? { ...exercise, ...updates } : exercise
      );
      
      setExercises(updatedExercises);
      await workoutStorage.saveExercises(updatedExercises);
      
      // Muat ulang semua data untuk memastikan konsistensi di seluruh aplikasi
      await loadAllData();
      
      return updatedExercises.find(e => e.id === exerciseId);
    } catch (error) {
      console.error('Error editing exercise:', error);
      throw error;
    }
  };

  const deleteExercise = async (exerciseId: string) => {
    try {
      const filteredExercises = exercises.filter(exercise => exercise.id !== exerciseId);
      setExercises(filteredExercises);
      await workoutStorage.saveExercises(filteredExercises);
      
      // Update today's exercises
      const today = new Date().toISOString().split('T')[0];
      const todaysExercises = filteredExercises.filter(e => e.date === today);
      setTodayExercises(todaysExercises);
    } catch (error) {
      console.error('Error updating exercise:', error);
      throw error;
    }
  };

  // Scheduled workout functions
  const addScheduledWorkout = async (scheduledWorkout: any) => {
    try {
      const newScheduled = {
        ...scheduledWorkout,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      
      const updatedScheduled = [...scheduledWorkouts, newScheduled];
      setScheduledWorkouts(updatedScheduled);
      await workoutStorage.saveScheduledWorkouts(updatedScheduled);
      
      return newScheduled;
    } catch (error) {
      console.error('Error adding scheduled workout:', error);
      throw error;
    }
  };

  const updateScheduledWorkout = async (scheduledId: string, updates: any) => {
    try {
      const updatedScheduled = scheduledWorkouts.map(scheduled =>
        scheduled.id === scheduledId ? { ...scheduled, ...updates } : scheduled
      );
      
      setScheduledWorkouts(updatedScheduled);
      await workoutStorage.saveScheduledWorkouts(updatedScheduled);
    } catch (error) {
      console.error('Error updating scheduled workout:', error);
      throw error;
    }
  };

  const deleteScheduledWorkout = async (scheduledId: string) => {
    try {
      const filteredScheduled = scheduledWorkouts.filter(
        scheduled => scheduled.id !== scheduledId
      );
      setScheduledWorkouts(filteredScheduled);
      await workoutStorage.saveScheduledWorkouts(filteredScheduled);
    } catch (error) {
      console.error('Error deleting scheduled workout:', error);
      throw error;
    }
  };

  // Activity functions
  const addActivity = async (activity: any) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const newActivity = {
        ...activity,
        id: Date.now().toString(),
        date: activity.date || today,
        createdAt: new Date().toISOString(),
      };
      
      const updatedActivities = [...activities, newActivity];
      setActivities(updatedActivities);
      await workoutStorage.saveActivities(updatedActivities);
      
      return newActivity;
    } catch (error) {
      console.error('Error adding activity:', error);
      throw error;
    }
  };

  const updateActivity = async (activityId: string, updates: any) => {
    try {
      const updatedActivities = activities.map(activity =>
        activity.id === activityId ? { ...activity, ...updates } : activity
      );
      
      setActivities(updatedActivities);
      await workoutStorage.saveActivities(updatedActivities);
    } catch (error) {
      console.error('Error updating activity:', error);
      throw error;
    }
  };

  // User profile functions
  const updateUserProfile = async (profileUpdates: any) => {
    try {
      const updatedProfile = { ...userProfile, ...profileUpdates };
      setUserProfile(updatedProfile);
      await workoutStorage.saveUserProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  // Stats functions
  const updateWorkoutStats = async (statsUpdates: any) => {
    try {
      const updatedStats = { ...workoutStats, ...statsUpdates };
      setWorkoutStats(updatedStats);
      await workoutStorage.saveWorkoutStats(updatedStats);
    } catch (error) {
      console.error('Error updating workout stats:', error);
      throw error;
    }
  };

  // Toggle exercise completion (for Dashboard)
  const toggleExerciseCompleted = async (exerciseIndex: number) => {
    if (!todayWorkout) return;
    
    const updatedExercises = todayWorkout.exercises.map((ex: any, i: number) => 
      i === exerciseIndex ? { ...ex, completed: !ex.completed } : ex
    );
    
    const updatedWorkout = {
      ...todayWorkout,
      exercises: updatedExercises
    };
    
    setTodayWorkout(updatedWorkout);
    await updateWorkout(todayWorkout.id, updatedWorkout);
    
    // Update today's exercises
    const today = new Date().toISOString().split('T')[0];
    const exerciseToUpdate = updatedExercises[exerciseIndex];
    const updatedTodayExercises = todayExercises.map(ex => 
      ex.name === exerciseToUpdate.name 
        ? { ...ex, completed: exerciseToUpdate.completed, timeCompleted: exerciseToUpdate.completed ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined }
        : ex
    );
    setTodayExercises(updatedTodayExercises);
    
    // Update exercises in storage
    const allExercises = exercises.map(ex => 
      ex.name === exerciseToUpdate.name && ex.date === today
        ? { ...ex, completed: exerciseToUpdate.completed, timeCompleted: exerciseToUpdate.completed ? new Date().toISOString() : undefined }
        : ex
    );
    setExercises(allExercises);
    await workoutStorage.saveExercises(allExercises);
  };

  return {
    // Data
    workouts,
    exercises,
    scheduledWorkouts,
    activities,
    userProfile,
    workoutStats,
    todayWorkout,
    todayExercises,
    loading,
    
    // Functions
    addWorkout,
    updateWorkout,
    deleteWorkout,
    addExercise,
    updateExercise,
    editExercise,
    deleteExercise,
    addScheduledWorkout,
    updateScheduledWorkout,
    deleteScheduledWorkout,
    addActivity,
    updateActivity,
    updateUserProfile,
    updateWorkoutStats,
    toggleExerciseCompleted,
    loadAllData,
  };
}
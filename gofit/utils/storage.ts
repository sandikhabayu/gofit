import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  WORKOUTS: 'workouts',
  EXERCISES: 'exercises',
  SCHEDULED_WORKOUTS: 'scheduled_workouts',
  WORKOUT_STATS: 'workout_stats',
  ACTIVITIES: 'activities',
} as const;

// Generic storage functions
export const storage = {
  // Save data
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    }
  },

  // Get data
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  },

  // Remove data
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  },

  // Clear all data
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },

  // Get all keys
  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting keys:', error);
      return [];
    }
  },
};

// Specific workout data functions
export const workoutStorage = {
  // Save user profile
  async saveUserProfile(profile: any): Promise<void> {
    await storage.setItem(STORAGE_KEYS.USER_PROFILE, profile);
  },

  // Get user profile
  async getUserProfile(): Promise<any> {
    return await storage.getItem(STORAGE_KEYS.USER_PROFILE);
  },

  // Save workouts
  async saveWorkouts(workouts: any[]): Promise<void> {
    await storage.setItem(STORAGE_KEYS.WORKOUTS, workouts);
  },

  // Get workouts
  async getWorkouts(): Promise<any[]> {
    const workouts = await storage.getItem<any[]>(STORAGE_KEYS.WORKOUTS);
    return workouts || [];
  },

  // Add new workout
  async addWorkout(workout: any): Promise<void> {
    const existingWorkouts = await this.getWorkouts();
    const updatedWorkouts = [...existingWorkouts, workout];
    await this.saveWorkouts(updatedWorkouts);
  },

  // Update workout
  async updateWorkout(workoutId: string, updatedWorkout: any): Promise<void> {
    const workouts = await this.getWorkouts();
    const updatedWorkouts = workouts.map(workout => 
      workout.id === workoutId ? { ...workout, ...updatedWorkout } : workout
    );
    await this.saveWorkouts(updatedWorkouts);
  },

  // Delete workout
  async deleteWorkout(workoutId: string): Promise<void> {
    const workouts = await this.getWorkouts();
    const filteredWorkouts = workouts.filter(workout => workout.id !== workoutId);
    await this.saveWorkouts(filteredWorkouts);
  },

  // Save exercises
  async saveExercises(exercises: any[]): Promise<void> {
    await storage.setItem(STORAGE_KEYS.EXERCISES, exercises);
  },

  // Get exercises
  async getExercises(): Promise<any[]> {
    const exercises = await storage.getItem<any[]>(STORAGE_KEYS.EXERCISES);
    return exercises || [];
  },

  // Save scheduled workouts
  async saveScheduledWorkouts(scheduledWorkouts: any[]): Promise<void> {
    await storage.setItem(STORAGE_KEYS.SCHEDULED_WORKOUTS, scheduledWorkouts);
  },

  // Get scheduled workouts
  async getScheduledWorkouts(): Promise<any[]> {
    const scheduled = await storage.getItem<any[]>(STORAGE_KEYS.SCHEDULED_WORKOUTS);
    return scheduled || [];
  },

  // Save workout stats
  async saveWorkoutStats(stats: any): Promise<void> {
    await storage.setItem(STORAGE_KEYS.WORKOUT_STATS, stats);
  },

  // Get workout stats
  async getWorkoutStats(): Promise<any> {
    return await storage.getItem(STORAGE_KEYS.WORKOUT_STATS);
  },

  // Save activities
  async saveActivities(activities: any[]): Promise<void> {
    await storage.setItem(STORAGE_KEYS.ACTIVITIES, activities);
  },

  // Get activities
  async getActivities(): Promise<any[]> {
    const activities = await storage.getItem<any[]>(STORAGE_KEYS.ACTIVITIES);
    return activities || [];
  },
};
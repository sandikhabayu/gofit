import React, { useState } from 'react';
import { useWorkoutData } from '@/hooks/useLocalStorage';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, CircleCheck as CheckCircle, Calendar, Target, Trash2 } from 'lucide-react-native';
import { ProgressCircle } from '@/components/ProgressCircle';
import { WorkoutCard } from '@/components/WorkoutCard';
import { EditExerciseModal } from '@/components/EditExerciseModal';

export default function Dashboard() {
  const { 
    todayWorkout,
    todayExercises,
    toggleExerciseCompleted,
    updateWorkout,
    deleteWorkout,
    deleteExercise,
    loading 
  } = useWorkoutData();
  
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  
  const completedExercises = todayWorkout?.exercises?.filter((ex: any) => ex.completed).length || 0;
  const totalExercises = todayWorkout?.exercises?.length || 0;
  const progressPercentage = (completedExercises / totalExercises) * 100;

  const markWorkoutCompleted = async () => {
    if (!todayWorkout) return;
    
    try {
      const completedWorkout = {
        ...todayWorkout,
        completed: true,
        completedAt: new Date().toISOString(),
        exercises: todayWorkout.exercises.map((ex: any) => ({ ...ex, completed: true }))
      };
      
      await updateWorkout(todayWorkout.id, completedWorkout);
    } catch (error) {
      console.error('Error completing workout:', error);
    }
  };

  const deleteWorkoutData = async () => {
    if (!todayWorkout) return;
    
    Alert.alert(
      'Delete Today\'s Workout',
      'Are you sure you want to delete today\'s workout? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteWorkout(todayWorkout.id);
              // Also delete today's exercises
              for (const exercise of todayExercises) {
                await deleteExercise(exercise.id);
              }
            } catch (error) {
              console.error('Error deleting workout:', error);
              Alert.alert('Error', 'Failed to delete workout');
            }
          },
        },
      ]
    );
  };

  const editExerciseData = async (exerciseId: string, exerciseName: string) => {
    const exercise = todayExercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setSelectedExercise(exercise);
      setEditModalVisible(true);
    }
  };

  const handleSaveEdit = async (exerciseId: string, updates: any) => {
    try {
      await editExercise(exerciseId, updates);
    } catch (error) {
      console.error('Error editing exercise:', error);
      Alert.alert('Error', 'Failed to edit exercise');
    }
  };

  const deleteIndividualExercise = async (exerciseId: string, exerciseName: string) => {
    Alert.alert(
      'Delete Exercise',
      `Are you sure you want to delete "${exerciseName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExercise(exerciseId);
              
              // Update today's workout to remove this exercise
              if (todayWorkout) {
                const updatedExercises = todayWorkout.exercises.filter(
                  (ex: any) => ex.name !== exerciseName
                );
                await updateWorkout(todayWorkout.id, { exercises: updatedExercises });
              }
            } catch (error) {
              console.error('Error deleting exercise:', error);
              Alert.alert('Error', 'Failed to delete exercise');
            }
          },
        },
      ]
    );
  };
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning!</Text>
          <Text style={styles.subtitle}>Ready for today's workout?</Text>
        </View>

        {/* Progress Circle */}
        <View style={styles.progressSection}>
          <ProgressCircle 
            progress={totalExercises > 0 ? progressPercentage : 0} 
            size={120} 
            strokeWidth={8}
          />
          <Text style={styles.progressText}>
            {completedExercises}/{totalExercises} exercises completed
          </Text>
        </View>

        {/* Today's Workout */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Workout</Text>
            <View style={styles.headerActions}>
              <Calendar size={20} color="#64748B" />
              {todayWorkout && (
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={deleteWorkoutData}
                >
                  <Trash2 size={18} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          {todayWorkout ? (
            <WorkoutCard 
              workout={todayWorkout}
              onExerciseToggle={toggleExerciseCompleted}
              onExerciseDelete={deleteIndividualExercise}
              todayExercises={todayExercises}
            />
          ) : (
            <View style={styles.emptyWorkout}>
              <Text style={styles.emptyText}>No workout scheduled for today</Text>
              <Text style={styles.emptySubtext}>Add exercises to get started!</Text>
            </View>
          )}

          {todayWorkout && !todayWorkout.completed && totalExercises > 0 && (
            <TouchableOpacity 
              style={styles.completeButton}
              onPress={markWorkoutCompleted}
            >
              <CheckCircle size={20} color="#FFFFFF" />
              <Text style={styles.completeButtonText}>Mark as Completed</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Goals</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Target size={24} color="#059669" />
              <Text style={styles.statNumber}>{totalExercises}</Text>
              <Text style={styles.statLabel}>Exercises</Text>
            </View>
            <View style={styles.statCard}>
              <Target size={24} color="#EA580C" />
              <Text style={styles.statNumber}>45</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
            <View style={styles.statCard}>
              <Target size={24} color="#7C3AED" />
              <Text style={styles.statNumber}>300</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
          </View>
        </View>

        {/* Add New Task Button */}
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('add-task')}>
          <Plus size={24} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add New Workout</Text>
        </TouchableOpacity>
        
        <EditExerciseModal
          visible={editModalVisible}
          exercise={selectedExercise}
          onSave={handleSaveEdit}
          onClose={() => {
            setEditModalVisible(false);
            setSelectedExercise(null);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  progressText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
    color: '#475569',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteButton: {
    padding: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  completeButton: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 15,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#1E40AF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#64748B',
  },
  emptyWorkout: {
    backgroundColor: '#FFFFFF',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
});
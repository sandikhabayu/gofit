import React, { useState } from 'react';
import { useWorkoutData } from '@/hooks/useLocalStorage';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Plus, Clock, CreditCard as Edit, Trash2 } from 'lucide-react-native';
import { ScheduleCalendar } from '@/components/ScheduleCalendar';

interface ScheduledWorkout {
  id: string;
  name: string;
  date: string;
  time: string;
  duration: number;
  type: 'strength' | 'cardio' | 'flexibility' | 'mixed';
  status: 'scheduled' | 'completed' | 'missed';
}

export default function Schedule() {
  const { 
    scheduledWorkouts, 
    addScheduledWorkout, 
    updateScheduledWorkout, 
    deleteScheduledWorkout,
    loading 
  } = useWorkoutData();

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const selectedDateWorkouts = scheduledWorkouts.filter(
    workout => workout.date === selectedDate
  );

  const getWorkoutTypeColor = (type: string) => {
    switch (type) {
      case 'strength': return '#1E40AF';
      case 'cardio': return '#EF4444';
      case 'flexibility': return '#7C3AED';
      case 'mixed': return '#059669';
      default: return '#64748B';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#059669';
      case 'missed': return '#EF4444';
      case 'scheduled': return '#EA580C';
      default: return '#64748B';
    }
  };

  const deleteWorkout = async (id: string) => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this scheduled workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteScheduledWorkout(id);
            } catch (error) {
              console.error('Error deleting workout:', error);
              Alert.alert('Error', 'Failed to delete workout');
            }
          },
        },
      ]
    );
  };

  const editWorkout = async (id: string) => {
    // You can implement a form modal here
    Alert.alert('Edit Workout', 'Edit workout functionality would be implemented here');
  };

  const addNewWorkout = async () => {
    // You can implement a form modal here
    Alert.alert('Add Workout', 'Add workout functionality would be implemented here');
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
          <Text style={styles.title}>Workout Schedule</Text>
          <Text style={styles.subtitle}>Plan and manage your fitness routine</Text>
        </View>

        {/* Schedule Calendar */}
        <ScheduleCalendar 
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          scheduledWorkouts={scheduledWorkouts}
        />

        {/* Add Workout Button */}
        <TouchableOpacity style={styles.addButton} onPress={addNewWorkout}>
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Schedule New Workout</Text>
        </TouchableOpacity>

        {/* Selected Date Workouts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedDate === new Date().toISOString().split('T')[0] 
                ? "Today's Schedule" 
                : `Schedule for ${new Date(selectedDate).toLocaleDateString()}`}
            </Text>
            <Calendar size={20} color="#64748B" />
          </View>

          {selectedDateWorkouts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No workouts scheduled for this day</Text>
              <TouchableOpacity style={styles.emptyActionButton} onPress={addNewWorkout}>
                <Plus size={16} color="#1E40AF" />
                <Text style={styles.emptyActionText}>Add Workout</Text>
              </TouchableOpacity>
            </View>
          ) : (
            selectedDateWorkouts.map(workout => (
              <View key={workout.id} style={styles.workoutCard}>
                <View style={styles.workoutHeader}>
                  <View style={styles.workoutInfo}>
                    <Text style={styles.workoutName}>{workout.name}</Text>
                    <View style={styles.workoutMeta}>
                      <Clock size={14} color="#64748B" />
                      <Text style={styles.workoutTime}>{workout.time}</Text>
                      <Text style={styles.workoutDuration}>• {workout.duration} min</Text>
                    </View>
                  </View>
                  <View style={styles.workoutActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => editWorkout(workout.id)}
                    >
                      <Edit size={16} color="#64748B" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => deleteWorkout(workout.id)}
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.workoutFooter}>
                  <View 
                    style={[
                      styles.typeIndicator, 
                      { backgroundColor: getWorkoutTypeColor(workout.type) }
                    ]}
                  >
                    <Text style={styles.typeText}>
                      {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
                    </Text>
                  </View>
                  <View 
                    style={[
                      styles.statusIndicator, 
                      { backgroundColor: getStatusColor(workout.status) }
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {workout.status.charAt(0).toUpperCase() + workout.status.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Weekly Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.weeklyStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {scheduledWorkouts.filter(w => w.status === 'completed').length}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {scheduledWorkouts.filter(w => w.status === 'scheduled').length}
              </Text>
              <Text style={styles.statLabel}>Scheduled</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {scheduledWorkouts.filter(w => w.status === 'missed').length}
              </Text>
              <Text style={styles.statLabel}>Missed</Text>
            </View>
          </View>
        </View>
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
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  addButton: {
    backgroundColor: '#1E40AF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 25,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  emptyState: {
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
    marginBottom: 15,
  },
  emptyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emptyActionText: {
    color: '#1E40AF',
    fontWeight: '600',
    marginLeft: 4,
  },
  workoutCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutTime: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  workoutDuration: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  workoutActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  workoutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  weeklyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#64748B',
  },
});
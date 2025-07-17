import React, { useState } from 'react';
import { useWorkoutData } from '@/hooks/useLocalStorage';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'lucide-react-native';
import { WeeklyCalendar } from '@/components/WeeklyCalendar';
import { ActivityCard } from '@/components/ActivityCard';
import { EditExerciseModal } from '@/components/EditExerciseModal'; // SOLUSI: Impor modal

export default function Tracking() {
  const { 
    activities, 
    todayExercises,
    updateActivity,
    editExercise, // SOLUSI: Ambil fungsi editExercise dari hook
    loading 
  } = useWorkoutData();

  // SOLUSI: Deklarasikan state yang dibutuhkan untuk modal
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  const selectedDateActivities = activities.filter(activity => activity.date === selectedDate);
  const weeklyStats = activities.reduce((acc, activity) => {
    if (activity.status === 'completed') {
      acc.completed += 1;
      acc.totalDuration += activity.duration || 0;
    }
    return acc;
  }, { completed: 0, totalDuration: 0 });

  const resumeActivity = async (activityId: string) => {
    try {
      await updateActivity(activityId, { 
        status: 'in-progress',
        resumedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error resuming activity:', error);
    }
  };

  // SOLUSI: Buat fungsi handleSaveEdit
  const handleSaveEdit = async (exerciseId: string, updates: any) => {
    try {
      await editExercise(exerciseId, updates);
      Alert.alert('Success', 'Exercise updated successfully!');
    } catch (error) {
      console.error('Error saving exercise:', error);
      Alert.alert('Error', 'Failed to update exercise');
    }
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
          <Text style={styles.title}>Activity Tracking</Text>
          <Text style={styles.subtitle}>Monitor your weekly progress</Text>
        </View>

        {/* Weekly Calendar */}
        <WeeklyCalendar 
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          activities={activities}
        />

        {/* Weekly Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{weeklyStats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{weeklyStats.totalDuration}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{activities.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* Today's Activities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedDate === new Date().toISOString().split('T')[0] ? "Today's Activities" : `Activities for ${new Date(selectedDate).toLocaleDateString()}`}
            </Text>
            <Calendar size={20} color="#64748B" />
          </View>

          {selectedDateActivities.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {selectedDate === new Date().toISOString().split('T')[0] 
                  ? "No activities for today" 
                  : "No activities for this day"}
              </Text>
              {selectedDate === new Date().toISOString().split('T')[0] && todayExercises.length > 0 && (
                <Text style={styles.emptySubtext}>
                  You have {todayExercises.length} exercises logged for today
                </Text>
              )}
            </View>
          ) : (
            selectedDateActivities.map(activity => (
              <ActivityCard 
                key={activity.id}
                activity={activity}
                onResume={() => resumeActivity(activity.id)}
              />
            ))
          )}
        </View>
        
        {/* Today's Exercise Summary (only show on today's date) */}
        {selectedDate === new Date().toISOString().split('T')[0] && todayExercises.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Exercise Summary</Text>
            <View style={styles.exerciseSummary}>
              {todayExercises.map((exercise, index) => (
                <Text key={index} style={styles.exerciseItem}>
                  • {exercise.name}: {exercise.sets} sets × {exercise.reps} reps {exercise.completed ? '✓' : '○'}
                </Text>
              ))}
            </View>
          </View>
        )}
        
        {/* Kode modal sekarang menjadi valid */}
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
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
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
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
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#64748B',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 8,
    textAlign: 'center',
  },
  exerciseSummary: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseItem: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 4,
  },
});
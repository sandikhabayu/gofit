import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, Pause, CircleCheck as CheckCircle, Clock } from 'lucide-react-native';

interface Activity {
  id: string;
  name: string;
  date: string;
  status: 'completed' | 'in-progress' | 'scheduled';
  exercises: { name: string; completed: number; total: number }[];
  duration?: number;
}

interface ActivityCardProps {
  activity: Activity;
  onResume: () => void;
}

export function ActivityCard({ activity, onResume }: ActivityCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#059669';
      case 'in-progress': return '#EA580C';
      case 'scheduled': return '#1E40AF';
      default: return '#64748B';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={20} color="#059669" />;
      case 'in-progress': return <Play size={20} color="#EA580C" />;
      case 'scheduled': return <Clock size={20} color="#1E40AF" />;
      default: return <Clock size={20} color="#64748B" />;
    }
  };

  const totalCompleted = activity.exercises.reduce((sum, ex) => sum + ex.completed, 0);
  const totalTarget = activity.exercises.reduce((sum, ex) => sum + ex.total, 0);
  const progressPercentage = totalTarget > 0 ? (totalCompleted / totalTarget) * 100 : 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.activityName}>{activity.name}</Text>
          <View style={styles.statusContainer}>
            {getStatusIcon(activity.status)}
            <Text style={[styles.statusText, { color: getStatusColor(activity.status) }]}>
              {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
            </Text>
          </View>
        </View>
        {activity.duration && (
          <Text style={styles.duration}>{activity.duration} minutes</Text>
        )}
      </View>

      <View style={styles.exercisesList}>
        {activity.exercises.map((exercise, index) => (
          <View key={index} style={styles.exerciseItem}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseProgress}>
              {exercise.completed}/{exercise.total} reps
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${progressPercentage}%`,
                backgroundColor: getStatusColor(activity.status)
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {progressPercentage.toFixed(0)}% completed
        </Text>
      </View>

      {activity.status === 'in-progress' && (
        <TouchableOpacity style={styles.resumeButton} onPress={onResume}>
          <Play size={16} color="#FFFFFF" />
          <Text style={styles.resumeButtonText}>Resume</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
  header: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  duration: {
    fontSize: 14,
    color: '#64748B',
  },
  exercisesList: {
    marginBottom: 12,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  exerciseName: {
    fontSize: 14,
    color: '#475569',
  },
  exerciseProgress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  progressSection: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resumeButton: {
    backgroundColor: '#EA580C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  resumeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
    marginRight: 4,
    backgroundColor: '#EBF4FF',
    borderRadius: 6,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 6,
  },
});
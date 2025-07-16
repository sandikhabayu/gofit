import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircleCheck as CheckCircle, Circle, Clock, Edit, Trash2 } from 'lucide-react-native';

interface TodayExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  completed: boolean;
  timeCompleted?: string;
}

interface ExerciseListProps {
  exercises: TodayExercise[];
  onExerciseEdit?: (exerciseId: string) => void;
  onExerciseDelete?: (exerciseId: string, exerciseName: string) => void;
}

// SOLUSI: Pastikan onExerciseEdit dan onExerciseDelete diambil dari props
export function ExerciseList({ exercises, onExerciseEdit, onExerciseDelete }: ExerciseListProps) {
  const completedCount = exercises.filter(ex => ex.completed).length;
  const totalCount = exercises.length;

  if (exercises.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No exercises added yet</Text>
        <Text style={styles.emptySubtext}>Add exercises using the form above</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.progressText}>
          {completedCount}/{totalCount} exercises completed
        </Text>
      </View>
      
      <View style={styles.exercisesList}>
        {exercises.map((exercise) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <View style={styles.exerciseInfo}>
                <Text style={[
                  styles.exerciseName,
                  exercise.completed && styles.completedText
                ]}>
                  {exercise.name}
                </Text>
                <Text style={styles.exerciseDetails}>
                  {exercise.sets} sets × {exercise.reps} reps
                  {exercise.weight && ` @ ${exercise.weight}kg`}
                </Text>
              </View>
              
              <View style={styles.statusContainer}>
                {exercise.completed ? (
                  <CheckCircle size={24} color="#059669" />
                ) : (
                  <Circle size={24} color="#94A3B8" />
                )}
              </View>
              
              <View style={styles.exerciseActions}>
                {onExerciseEdit && (
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => onExerciseEdit(exercise.id)}
                  >
                    <Edit size={16} color="#1E40AF" />
                  </TouchableOpacity>
                )}
                
                {onExerciseDelete && (
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => onExerciseDelete(exercise.id, exercise.name)}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            
            {exercise.timeCompleted && (
              <View style={styles.timeContainer}>
                <Clock size={12} color="#64748B" />
                <Text style={styles.timeText}>
                  Completed at {exercise.timeCompleted}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    textAlign: 'center',
  },
  exercisesList: {
    gap: 12,
  },
  exerciseCard: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1E40AF',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  statusContainer: {
    marginLeft: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  exerciseActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionButton: {
    padding: 6,
    marginLeft: 4,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    padding: 20,
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
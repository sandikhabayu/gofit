import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircleCheck as CheckCircle, Circle, Trash2, Edit } from 'lucide-react-native';

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

interface WorkoutCardProps {
  workout: Workout;
  onExerciseToggle: (index: number) => void;
  onExerciseEdit?: (exerciseId: string, exerciseName: string) => void;
  onExerciseDelete?: (exerciseId: string, exerciseName: string) => void;
  todayExercises?: any[];
}

export function WorkoutCard({ 
  workout, 
  onExerciseToggle, 
  onExerciseEdit,
  onExerciseDelete,
  todayExercises = []
}: WorkoutCardProps) {
  const completedExercises = workout.exercises.filter(ex => ex.completed).length;
  const totalExercises = workout.exercises.length;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.workoutName}>{workout.name}</Text>
        <Text style={styles.progress}>
          {completedExercises}/{totalExercises}
        </Text>
      </View>
      
      <View style={styles.exercisesList}>
        {workout.exercises.map((exercise, index) => (
          <View 
            key={index}
            style={styles.exerciseItem}
          >
            <TouchableOpacity 
              style={styles.exerciseContent}
              onPress={() => onExerciseToggle(index)}
            >
              <View style={styles.exerciseInfo}>
                <Text style={[
                  styles.exerciseName, 
                  exercise.completed && styles.completedText
                ]}>
                  {exercise.name}
                </Text>
                <Text style={styles.exerciseDetails}>
                  {exercise.sets} sets × {exercise.reps} reps
                </Text>
              </View>
              {exercise.completed ? (
                <CheckCircle size={24} color="#059669" />
              ) : (
                <Circle size={24} color="#94A3B8" />
              )}
            </TouchableOpacity>
            
            <View style={styles.exerciseActions}>
              {onExerciseEdit && (
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => {
                    const exerciseId = todayExercises.find(ex => ex.name === exercise.name)?.id;
                    if (exerciseId) {
                      onExerciseEdit(exerciseId, exercise.name);
                    }
                  }}
                >
                  <Edit size={16} color="#1E40AF" />
                </TouchableOpacity>
              )}
              
              {onExerciseDelete && (
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => {
                    const exerciseId = todayExercises.find(ex => ex.name === exercise.name)?.id;
                    if (exerciseId) {
                      onExerciseDelete(exerciseId, exercise.name);
                    }
                  }}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  progress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  exercisesList: {
    gap: 12,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  exerciseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
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
  exerciseActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
});
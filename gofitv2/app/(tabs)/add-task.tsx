import React, { useState } from 'react';
import { useWorkoutData } from '@/hooks/useLocalStorage';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Save, X, Clock } from 'lucide-react-native';
import { ExerciseList } from '@/components/ExerciseList';
import { EditExerciseModal } from '@/components/EditExerciseModal';
import { useNavigation } from '@react-navigation/native';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  notes?: string;
}

export default function AddTask() {
  const { 
    todayExercises,
    addWorkout, 
    addExercise,
    editExercise,
    deleteExercise,
    loading 
  } = useWorkoutData();

  const navigation = useNavigation();
  
  const [workoutName, setWorkoutName] = useState('');
  const [workoutExercises, setWorkoutExercises] = useState<Exercise[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    duration: '',
    notes: '',
  });

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  const addExerciseToWorkout = async () => {
    if (!currentExercise.name || !currentExercise.sets || !currentExercise.reps) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const newExercise: Exercise = {
        id: Date.now().toString(),
        name: currentExercise.name,
        sets: parseInt(currentExercise.sets),
        reps: parseInt(currentExercise.reps),
        weight: currentExercise.weight ? parseFloat(currentExercise.weight) : undefined,
        duration: currentExercise.duration ? parseInt(currentExercise.duration) : undefined,
        notes: currentExercise.notes || undefined,
      };

      setWorkoutExercises([...workoutExercises, newExercise]);
      
      await addExercise(newExercise);
      
      setCurrentExercise({
        name: '',
        sets: '',
        reps: '',
        weight: '',
        duration: '',
        notes: '',
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding exercise:', error);
      Alert.alert('Error', 'Failed to save exercise');
    }
  };

  const removeExercise = async (id: string) => {
    setWorkoutExercises(workoutExercises.filter(ex => ex.id !== id));
  };

  const saveWorkout = async () => {
    if (!workoutName || workoutExercises.length === 0) {
      Alert.alert('Error', 'Please add a workout name and at least one exercise');
      return;
    }

    try {
      const workout = {
        id: Date.now().toString(),
        name: workoutName,
        exercises: workoutExercises,
        createdAt: new Date().toISOString(),
        completed: false,
        date: new Date().toISOString().split('T')[0],
      };

      // Pertama, simpan semua exercises ke storage
    await Promise.all(
      workoutExercises.map(exercise => 
        addExercise({
          ...exercise,
          workoutId: workout.id, // Tambahkan referensi ke workout
          date: workout.date,
        })
      )
    );
      
      await addWorkout(workout);
      
      Alert.alert('Success', 'Workout saved successfully!');
      setWorkoutName('');
      setWorkoutExercises([]);
      navigation.goBack();  // Balik ke dashboard
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert('Error', 'Failed to save workout');
    }
  };

  const editExerciseData = (exerciseId: string) => {
    const exercise = todayExercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setSelectedExercise(exercise);
      setEditModalVisible(true);
    }
  };

  const handleSaveEdit = async (exerciseId: string, updates: any) => {
    try {
      await editExercise(exerciseId, updates);
      Alert.alert('Success', 'Exercise updated successfully!');
    } catch (error) {
      console.error('Error editing exercise:', error);
      Alert.alert('Error', 'Failed to update exercise');
    }
  };

  const deleteExerciseData = (exerciseId: string, exerciseName: string) => {
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
        {/* ... (kode header, workout name, dan form tidak berubah) ... */}
        <View style={styles.header}>
          <Text style={styles.title}>Add New Task</Text>
          <Text style={styles.subtitle}>Create your custom workout</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Upper Body Strength"
            value={workoutName}
            onChangeText={setWorkoutName}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Workout ({workoutExercises.length})</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAddForm(!showAddForm)}
            >
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          {workoutExercises.map(exercise => (
            <View key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseDetails}>
                  {exercise.sets} sets × {exercise.reps} reps
                  {exercise.weight && ` @ ${exercise.weight}kg`}
                  {exercise.duration && ` (${exercise.duration}s)`}
                </Text>
                {exercise.notes && (
                  <Text style={styles.exerciseNotes}>{exercise.notes}</Text>
                )}
              </View>
              <TouchableOpacity onPress={() => removeExercise(exercise.id)}>
                <X size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}

          {showAddForm && (
            <View style={styles.addForm}>
              <Text style={styles.formTitle}>Add Workout</Text>
              
              <TextInput
                style={styles.textInput}
                placeholder="Workout name"
                value={currentExercise.name}
                onChangeText={(text) => setCurrentExercise(prev => ({ ...prev, name: text }))}
              />
              
              <View style={styles.formRow}>
                <TextInput
                  style={[styles.textInput, styles.halfInput]}
                  placeholder="Sets"
                  keyboardType="numeric"
                  value={currentExercise.sets}
                  onChangeText={(text) => setCurrentExercise(prev => ({ ...prev, sets: text }))}
                />
                <TextInput
                  style={[styles.textInput, styles.halfInput]}
                  placeholder="Reps"
                  keyboardType="numeric"
                  value={currentExercise.reps}
                  onChangeText={(text) => setCurrentExercise(prev => ({ ...prev, reps: text }))}
                />
              </View>
              
              <View style={styles.formRow}>
                <TextInput
                  style={[styles.textInput, styles.halfInput]}
                  placeholder="Weight (kg)"
                  keyboardType="numeric"
                  value={currentExercise.weight}
                  onChangeText={(text) => setCurrentExercise(prev => ({ ...prev, weight: text }))}
                />
                <TextInput
                  style={[styles.textInput, styles.halfInput]}
                  placeholder="Duration (s)"
                  keyboardType="numeric"
                  value={currentExercise.duration}
                  onChangeText={(text) => setCurrentExercise(prev => ({ ...prev, duration: text }))}
                />
              </View>
              
              <TextInput
                style={[styles.textInput, styles.notesInput]}
                placeholder="Notes (optional)"
                multiline
                value={currentExercise.notes}
                onChangeText={(text) => setCurrentExercise(prev => ({ ...prev, notes: text }))}
              />
              
              <View style={styles.formActions}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowAddForm(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={addExerciseToWorkout}
                >
                  <Text style={styles.saveButtonText}>Add Workout</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>


        {/* Bagian Today's Workout */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Workout</Text>
            <Clock size={20} color="#64748B" />
          </View>
          
          {/* ===========================================
            PERUBAHAN PENTING ADA DI SINI
            Pastikan kedua prop ini ada pada ExerciseList
            ===========================================
          */}
          {workoutExercises.length > 0 && (
          <TouchableOpacity style={styles.saveWorkoutButton} onPress={saveWorkout}>
            <Save size={20} color="#FFFFFF" />
            <Text style={styles.saveWorkoutText}>Save Workout</Text>
          </TouchableOpacity>
        )}
          
          <ExerciseList
            exercises={todayExercises}
            onExerciseEdit={editExerciseData}
            onExerciseDelete={deleteExerciseData}
          />
        </View>

        {/* ... (kode tombol Save Workout) ... */}
        
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

// Salin semua styles dari file asli Anda ke sini
const styles = StyleSheet.create({
  // ... (salin semua style yang ada di file add-task.tsx Anda ke sini) ...
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
  textInput: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#1E40AF',
    padding: 8,
    borderRadius: 8,
  },
  exerciseCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  exerciseNotes: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    fontStyle: 'italic',
  },
  addForm: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 15,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  halfInput: {
    width: '48%',
    margin: 0,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#64748B',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  saveWorkoutButton: {
    backgroundColor: '#1E40AF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  saveWorkoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  loadingText: {
    fontSize: 18,
    color: '#64748B',
  },
});
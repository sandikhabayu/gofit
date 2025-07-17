import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { Save, X } from 'lucide-react-native';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

interface EditExerciseModalProps {
  visible: boolean;
  exercise: Exercise | null;
  onSave: (exerciseId: string, updates: any) => Promise<void>;
  onClose: () => void;
}

export function EditExerciseModal({ visible, exercise, onSave, onClose }: EditExerciseModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    notes: '',
  });

  React.useEffect(() => {
    if (exercise) {
      setFormData({
        name: exercise.name,
        sets: exercise.sets.toString(),
        reps: exercise.reps.toString(),
        weight: exercise.weight?.toString() || '',
        notes: exercise.notes || '',
      });
    }
  }, [exercise]);

  const handleSave = async () => {
    if (!exercise || !formData.name || !formData.sets || !formData.reps) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const updates = {
        name: formData.name,
        sets: parseInt(formData.sets),
        reps: parseInt(formData.reps),
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        notes: formData.notes || undefined,
      };

      await onSave(exercise.id, updates);
      onClose();
      Alert.alert('Success', 'Exercise updated successfully!');
    } catch (error) {
      console.error('Error saving exercise:', error);
      Alert.alert('Error', 'Failed to update exercise');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sets: '',
      reps: '',
      weight: '',
      notes: '',
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <X size={24} color="#64748B" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Exercise</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Save size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Exercise Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholder="e.g., Push-ups"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Sets *</Text>
              <TextInput
                style={styles.input}
                value={formData.sets}
                onChangeText={(text) => setFormData(prev => ({ ...prev, sets: text }))}
                placeholder="3"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Reps *</Text>
              <TextInput
                style={styles.input}
                value={formData.reps}
                onChangeText={(text) => setFormData(prev => ({ ...prev, reps: text }))}
                placeholder="15"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={formData.weight}
              onChangeText={(text) => setFormData(prev => ({ ...prev, weight: text }))}
              placeholder="Optional"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={formData.notes}
              onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
              placeholder="Optional notes..."
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  saveButton: {
    backgroundColor: '#059669',
    padding: 8,
    borderRadius: 8,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 16,
    color: '#1E293B',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
});
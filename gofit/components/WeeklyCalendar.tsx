import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface Activity {
  id: string;
  name: string;
  date: string;
  status: 'completed' | 'in-progress' | 'scheduled';
}

interface WeeklyCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  activities: Activity[];
}

export function WeeklyCalendar({ selectedDate, onDateSelect, activities }: WeeklyCalendarProps) {
  const today = new Date();
  const currentWeek = [];
  
  // Get current week dates
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    currentWeek.push(date);
  }

  const getDateActivities = (date: string) => {
    return activities.filter(activity => activity.date === date);
  };

  const getStatusColor = (activities: Activity[]) => {
    if (activities.some(a => a.status === 'completed')) return '#059669';
    if (activities.some(a => a.status === 'in-progress')) return '#EA580C';
    if (activities.some(a => a.status === 'scheduled')) return '#1E40AF';
    return 'transparent';
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {currentWeek.map((date, index) => {
          const dateString = date.toISOString().split('T')[0];
          const dayActivities = getDateActivities(dateString);
          const isSelected = selectedDate === dateString;
          const isToday = dateString === today.toISOString().split('T')[0];
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayContainer,
                isSelected && styles.selectedDay,
                isToday && styles.todayBorder,
              ]}
              onPress={() => onDateSelect(dateString)}
            >
              <Text style={[
                styles.dayName,
                isSelected && styles.selectedText
              ]}>
                {date.toLocaleDateString('en', { weekday: 'short' })}
              </Text>
              <Text style={[
                styles.dayNumber,
                isSelected && styles.selectedText,
                isToday && styles.todayText
              ]}>
                {date.getDate()}
              </Text>
              {dayActivities.length > 0 && (
                <View 
                  style={[
                    styles.activityIndicator,
                    { backgroundColor: getStatusColor(dayActivities) }
                  ]} 
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  scrollView: {
    paddingVertical: 10,
  },
  dayContainer: {
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    minWidth: 60,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedDay: {
    backgroundColor: '#1E40AF',
  },
  todayBorder: {
    borderWidth: 2,
    borderColor: '#EA580C',
  },
  dayName: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
    fontWeight: '500',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  todayText: {
    color: '#EA580C',
  },
  activityIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
});
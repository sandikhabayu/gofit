import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface ScheduledWorkout {
  id: string;
  name: string;
  date: string;
  time: string;
  duration: number;
  type: 'strength' | 'cardio' | 'flexibility' | 'mixed';
  status: 'scheduled' | 'completed' | 'missed';
}

interface ScheduleCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  scheduledWorkouts: ScheduledWorkout[];
}

export function ScheduleCalendar({ selectedDate, onDateSelect, scheduledWorkouts }: ScheduleCalendarProps) {
  const today = new Date();
  const currentDate = new Date(selectedDate);
  
  // Get current month dates
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const dates = [];
  const currentIterDate = new Date(startDate);
  
  // Generate 6 weeks of dates
  for (let i = 0; i < 42; i++) {
    dates.push(new Date(currentIterDate));
    currentIterDate.setDate(currentIterDate.getDate() + 1);
  }

  const getDateWorkouts = (date: string) => {
    return scheduledWorkouts.filter(workout => workout.date === date);
  };

  const getWorkoutIndicatorColor = (workouts: ScheduledWorkout[]) => {
    if (workouts.some(w => w.status === 'completed')) return '#059669';
    if (workouts.some(w => w.status === 'missed')) return '#EF4444';
    if (workouts.some(w => w.status === 'scheduled')) return '#1E40AF';
    return 'transparent';
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month;
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    onDateSelect(newDate.toISOString().split('T')[0]);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View style={styles.container}>
      {/* Calendar Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigateMonth('prev')}>
          <ChevronLeft size={24} color="#64748B" />
        </TouchableOpacity>
        <Text style={styles.monthYear}>
          {monthNames[month]} {year}
        </Text>
        <TouchableOpacity onPress={() => navigateMonth('next')}>
          <ChevronRight size={24} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Week Days */}
      <View style={styles.weekDays}>
        {weekDays.map(day => (
          <Text key={day} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendar}>
        {dates.map((date, index) => {
          const dateString = date.toISOString().split('T')[0];
          const dayWorkouts = getDateWorkouts(dateString);
          const isSelected = selectedDate === dateString;
          const isTodayDate = isToday(date);
          const isCurrentMonthDate = isCurrentMonth(date);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateCell,
                isSelected && styles.selectedDate,
                isTodayDate && styles.todayDate,
                !isCurrentMonthDate && styles.otherMonthDate,
              ]}
              onPress={() => onDateSelect(dateString)}
            >
              <Text style={[
                styles.dateText,
                isSelected && styles.selectedDateText,
                isTodayDate && styles.todayDateText,
                !isCurrentMonthDate && styles.otherMonthDateText,
              ]}>
                {date.getDate()}
              </Text>
              {dayWorkouts.length > 0 && (
                <View style={styles.indicatorContainer}>
                  <View 
                    style={[
                      styles.workoutIndicator,
                      { backgroundColor: getWorkoutIndicatorColor(dayWorkouts) }
                    ]} 
                  />
                  <Text style={styles.workoutCount}>
                    {dayWorkouts.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
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
  monthYear: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    paddingVertical: 8,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dateCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  selectedDate: {
    backgroundColor: '#1E40AF',
    borderRadius: 8,
  },
  todayDate: {
    borderWidth: 2,
    borderColor: '#EA580C',
    borderRadius: 8,
  },
  otherMonthDate: {
    opacity: 0.3,
  },
  dateText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
  todayDateText: {
    color: '#EA580C',
    fontWeight: 'bold',
  },
  otherMonthDateText: {
    color: '#94A3B8',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 2,
  },
  workoutCount: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#64748B',
  },
});
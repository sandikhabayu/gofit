import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface ChartData {
  month: string;
  workouts: number;
  maxWorkouts: number;
}

export function StatsChart() {
  const chartData: ChartData[] = [
    { month: 'Jan', workouts: 12, maxWorkouts: 20 },
    { month: 'Feb', workouts: 18, maxWorkouts: 20 },
    { month: 'Mar', workouts: 15, maxWorkouts: 20 },
    { month: 'Apr', workouts: 22, maxWorkouts: 25 },
    { month: 'May', workouts: 19, maxWorkouts: 25 },
    { month: 'Jun', workouts: 25, maxWorkouts: 25 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.maxWorkouts));

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chartContainer}
      >
        {chartData.map((data, index) => {
          const barHeight = (data.workouts / maxValue) * 120;
          const targetHeight = (data.maxWorkouts / maxValue) * 120;
          
          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barColumn}>
                {/* Target indicator */}
                <View 
                  style={[
                    styles.targetIndicator,
                    { bottom: targetHeight }
                  ]}
                />
                
                {/* Actual bar */}
                <View 
                  style={[
                    styles.bar,
                    { 
                      height: barHeight,
                      backgroundColor: data.workouts >= data.maxWorkouts ? '#059669' : '#1E40AF'
                    }
                  ]}
                />
                
                {/* Workout count */}
                <Text style={styles.workoutCount}>
                  {data.workouts}
                </Text>
              </View>
              
              {/* Month label */}
              <Text style={styles.monthLabel}>
                {data.month}
              </Text>
            </View>
          );
        })}
      </ScrollView>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#1E40AF' }]} />
          <Text style={styles.legendText}>Workouts</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#059669' }]} />
          <Text style={styles.legendText}>Goal Achieved</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.targetLine} />
          <Text style={styles.legendText}>Target</Text>
        </View>
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
  chartContainer: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  barContainer: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  barColumn: {
    height: 140,
    width: 40,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  bar: {
    width: 30,
    borderRadius: 4,
    marginBottom: 8,
  },
  targetIndicator: {
    position: 'absolute',
    width: 40,
    height: 2,
    backgroundColor: '#EF4444',
    borderRadius: 1,
  },
  workoutCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  monthLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 8,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  targetLine: {
    width: 16,
    height: 2,
    backgroundColor: '#EF4444',
    borderRadius: 1,
    marginRight: 4,
  },
  legendText: {
    fontSize: 10,
    color: '#64748B',
  },
});
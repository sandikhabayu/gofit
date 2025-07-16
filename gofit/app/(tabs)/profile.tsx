import React, { useState } from 'react';
import { useWorkoutData } from '@/hooks/useLocalStorage';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Target, Trophy, Calendar, Clock, CreditCard as Edit } from 'lucide-react-native';
import { StatsChart } from '@/components/StatsChart';

interface UserProfile {
  name: string;
  avatar: string;
  fitnessGoals: string[];
  memberSince: string;
}

interface WorkoutStats {
  totalWorkouts: number;
  totalDuration: number; // in minutes
  longestStreak: number; // in days
  currentStreak: number; // in days
  averageWorkoutDuration: number; // in minutes
  weeklyGoal: number; // workouts per week
  completedThisWeek: number;
}

export default function Profile() {
  const { 
    userProfile, 
    workoutStats, 
    updateUserProfile, 
    updateWorkoutStats,
    loading 
  } = useWorkoutData();

  const [user] = useState<UserProfile>({
    name: 'Alex Johnson',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    fitnessGoals: ['Build Muscle', 'Improve Endurance', 'Lose Weight'],
    memberSince: '2024-01-15',
  });

  const [stats] = useState<WorkoutStats>({
    totalWorkouts: 87,
    totalDuration: 4350, // 72.5 hours
    longestStreak: 14,
    currentStreak: 7,
    averageWorkoutDuration: 50,
    weeklyGoal: 5,
    completedThisWeek: 3,
  });

  const weeklyProgress = (stats.completedThisWeek / stats.weeklyGoal) * 100;

  const editProfile = async () => {
    // You can implement a form modal here
    Alert.alert('Edit Profile', 'Edit profile functionality would be implemented here');
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
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.editButton} onPress={editProfile}>
            <Edit size={20} color="#1E40AF" />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={styles.userCard}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <View style={styles.memberInfo}>
              <Calendar size={16} color="#64748B" />
              <Text style={styles.memberText}>
                Member since {new Date(user.memberSince).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Fitness Goals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fitness Goals</Text>
            <Target size={20} color="#64748B" />
          </View>
          <View style={styles.goalsContainer}>
            {user.fitnessGoals.map((goal, index) => (
              <View key={index} style={styles.goalTag}>
                <Text style={styles.goalText}>{goal}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Weekly Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week's Progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Weekly Goal</Text>
              <Text style={styles.progressValue}>
                {stats.completedThisWeek}/{stats.weeklyGoal} workouts
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${Math.min(weeklyProgress, 100)}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressPercentage}>
              {weeklyProgress.toFixed(0)}% completed
            </Text>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Workout Statistics</Text>
            <Trophy size={20} color="#64748B" />
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalWorkouts}</Text>
              <Text style={styles.statLabel}>Total Workouts</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{Math.round(stats.totalDuration / 60)}h</Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.longestStreak}</Text>
              <Text style={styles.statLabel}>Longest Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.currentStreak}</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <View style={styles.achievementsList}>
            <View style={styles.achievementItem}>
              <View style={styles.achievementIcon}>
                <Trophy size={20} color="#FFD700" />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementName}>7-Day Streak</Text>
                <Text style={styles.achievementDate}>Achieved today</Text>
              </View>
            </View>
            
            <View style={styles.achievementItem}>
              <View style={styles.achievementIcon}>
                <Target size={20} color="#059669" />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementName}>50 Workouts</Text>
                <Text style={styles.achievementDate}>Achieved 2 weeks ago</Text>
              </View>
            </View>
            
            <View style={styles.achievementItem}>
              <View style={styles.achievementIcon}>
                <Clock size={20} color="#EA580C" />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementName}>30 Hours Total</Text>
                <Text style={styles.achievementDate}>Achieved 1 month ago</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Workout Trend Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Workout Trend</Text>
          <StatsChart />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  editButton: {
    padding: 8,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 6,
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
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  goalTag: {
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  goalText: {
    color: '#1E40AF',
    fontWeight: '600',
    fontSize: 14,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  progressValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
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
    textAlign: 'center',
  },
  achievementsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  achievementDate: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
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
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Camera, Cloud, BookOpen, Newspaper, Bell } from 'lucide-react-native';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import VoiceButton from '@/components/VoiceButton';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
  backgroundColor: string;
}

function QuickAction({ icon, title, subtitle, onPress, backgroundColor }: QuickActionProps) {
  return (
    <TouchableOpacity 
      style={[styles.quickActionCard, { backgroundColor, width: cardWidth }]}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.quickActionIcon}>
        {icon}
      </View>
      <Text style={styles.quickActionTitle}>{title}</Text>
      <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);

  const handleVoicePress = () => {
    setIsListening(!isListening);
    // TODO: Implement voice recognition
    setTimeout(() => setIsListening(false), 3000);
  };

  const quickActions = [
    {
      icon: <TrendingUp size={32} color="#FFFFFF" />,
      title: 'Market Prices',
      subtitle: 'Check live rates',
      backgroundColor: '#3B82F6',
      onPress: () => console.log('Market prices'),
    },
    {
      icon: <Camera size={32} color="#FFFFFF" />,
      title: 'Disease Check',
      subtitle: 'Scan your crops',
      backgroundColor: '#EF4444',
      onPress: () => console.log('Disease detection'),
    },
    {
      icon: <Cloud size={32} color="#FFFFFF" />,
      title: 'Weather',
      subtitle: '7-day forecast',
      backgroundColor: '#06B6D4',
      onPress: () => console.log('Weather'),
    },
    {
      icon: <BookOpen size={32} color="#FFFFFF" />,
      title: 'Crop Diary',
      subtitle: 'Track progress',
      backgroundColor: '#22C55E',
      onPress: () => console.log('Crop diary'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>नमस्ते किसान भाई</Text>
            <Text style={styles.subGreeting}>Welcome Farmer</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={24} color="#22C55E" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
            <LanguageSwitcher
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </View>
        </View>

        {/* Voice Assistant */}
        <View style={styles.voiceSection}>
          <Text style={styles.voiceSectionTitle}>Voice Assistant</Text>
          <Text style={styles.voiceSectionSubtitle}>
            {isListening ? 'Listening...' : 'Tap to speak in your language'}
          </Text>
          <View style={styles.voiceButtonContainer}>
            <VoiceButton 
              onPress={handleVoicePress}
              isListening={isListening}
              size="large"
            />
          </View>
        </View>

        {/* Today's Highlights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Highlights</Text>
          <View style={styles.highlightCard}>
            <View style={styles.highlightContent}>
              <Text style={styles.highlightTitle}>Weather Alert</Text>
              <Text style={styles.highlightText}>
                Heavy rainfall expected in your area. Protect your crops from waterlogging.
              </Text>
            </View>
            <View style={styles.highlightIcon}>
              <Cloud size={24} color="#06B6D4" />
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <QuickAction
                key={index}
                icon={action.icon}
                title={action.title}
                subtitle={action.subtitle}
                backgroundColor={action.backgroundColor}
                onPress={action.onPress}
              />
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <Text style={styles.activityTitle}>Tomato - Field A</Text>
            <Text style={styles.activityText}>Last watered: 2 days ago</Text>
            <Text style={styles.activityStatus}>Next action: Fertilizer application</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  subGreeting: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    backgroundColor: '#EF4444',
    borderRadius: 4,
  },
  voiceSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  voiceSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  voiceSectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  voiceButtonContainer: {
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  highlightCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  highlightContent: {
    flex: 1,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  highlightText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  highlightIcon: {
    marginLeft: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 120,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  quickActionIcon: {
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  activityText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  activityStatus: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: '500',
  },
});
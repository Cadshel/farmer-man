import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Plus, 
  Calendar, 
  Droplets, 
  Scissors, 
  Sprout,
  TrendingUp,
  X,
  Check
} from 'lucide-react-native';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface CropEntry {
  id: string;
  cropName: string;
  variety: string;
  fieldName: string;
  plantingDate: string;
  area: number; // in acres
  status: 'planted' | 'growing' | 'flowering' | 'harvesting' | 'harvested';
  activities: Activity[];
  expectedHarvest: string;
}

interface Activity {
  id: string;
  type: 'watering' | 'fertilizing' | 'pesticide' | 'weeding' | 'harvesting' | 'other';
  description: string;
  date: string;
  cost?: number;
  notes?: string;
}

const mockCropEntries: CropEntry[] = [
  {
    id: '1',
    cropName: 'Wheat',
    variety: 'HD-2967',
    fieldName: 'Field A',
    plantingDate: '2024-11-15',
    area: 5.2,
    status: 'growing',
    expectedHarvest: '2025-04-10',
    activities: [
      {
        id: '1',
        type: 'watering',
        description: 'First irrigation',
        date: '2024-12-01',
        notes: 'Applied 2 inches of water'
      },
      {
        id: '2',
        type: 'fertilizing',
        description: 'Urea application',
        date: '2024-12-15',
        cost: 2500,
        notes: '50 kg urea per acre'
      }
    ]
  },
  {
    id: '2',
    cropName: 'Tomato',
    variety: 'Pusa Ruby',
    fieldName: 'Field B',
    plantingDate: '2024-12-01',
    area: 2.0,
    status: 'growing',
    expectedHarvest: '2025-03-15',
    activities: [
      {
        id: '3',
        type: 'pesticide',
        description: 'Fungicide spray',
        date: '2025-01-10',
        cost: 800,
        notes: 'Preventive spray for blight'
      }
    ]
  }
];

const activityTypes = [
  { type: 'watering', label: 'Watering', icon: <Droplets size={20} color="#3B82F6" /> },
  { type: 'fertilizing', label: 'Fertilizing', icon: <Sprout size={20} color="#22C55E" /> },
  { type: 'pesticide', label: 'Pesticide', icon: <Scissors size={20} color="#EF4444" /> },
  { type: 'weeding', label: 'Weeding', icon: <Scissors size={20} color="#F59E0B" /> },
  { type: 'harvesting', label: 'Harvesting', icon: <TrendingUp size={20} color="#8B5CF6" /> },
  { type: 'other', label: 'Other', icon: <Plus size={20} color="#6B7280" /> },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'planted': return '#3B82F6';
    case 'growing': return '#22C55E';
    case 'flowering': return '#F59E0B';
    case 'harvesting': return '#8B5CF6';
    case 'harvested': return '#6B7280';
    default: return '#6B7280';
  }
};

const getActivityIcon = (type: string) => {
  const activity = activityTypes.find(a => a.type === type);
  return activity?.icon || <Plus size={16} color="#6B7280" />;
};

interface CropCardProps {
  crop: CropEntry;
  onPress: () => void;
}

function CropCard({ crop, onPress }: CropCardProps) {
  const statusColor = getStatusColor(crop.status);
  const lastActivity = crop.activities[crop.activities.length - 1];

  return (
    <TouchableOpacity style={styles.cropCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cropCardHeader}>
        <View>
          <Text style={styles.cropName}>{crop.cropName}</Text>
          <Text style={styles.cropVariety}>{crop.variety} • {crop.fieldName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{crop.status}</Text>
        </View>
      </View>
      
      <View style={styles.cropDetails}>
        <View style={styles.cropDetailItem}>
          <Calendar size={16} color="#6B7280" />
          <Text style={styles.cropDetailText}>Planted: {crop.plantingDate}</Text>
        </View>
        <View style={styles.cropDetailItem}>
          <TrendingUp size={16} color="#6B7280" />
          <Text style={styles.cropDetailText}>Area: {crop.area} acres</Text>
        </View>
      </View>

      {lastActivity && (
        <View style={styles.lastActivity}>
          {getActivityIcon(lastActivity.type)}
          <Text style={styles.lastActivityText}>
            Last: {lastActivity.description} ({lastActivity.date})
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function DiaryScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [cropEntries, setCropEntries] = useState<CropEntry[]>(mockCropEntries);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<CropEntry | null>(null);

  const handleCropPress = (crop: CropEntry) => {
    setSelectedCrop(crop);
  };

  const handleBackToDiary = () => {
    setSelectedCrop(null);
  };

  if (selectedCrop) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Crop Detail Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToDiary}>
            <X size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{selectedCrop.cropName}</Text>
            <Text style={styles.headerSubtitle}>{selectedCrop.variety} • {selectedCrop.fieldName}</Text>
          </View>
          <LanguageSwitcher
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Crop Overview */}
          <View style={styles.overviewCard}>
            <View style={styles.overviewRow}>
              <View style={styles.overviewItem}>
                <Text style={styles.overviewLabel}>Planting Date</Text>
                <Text style={styles.overviewValue}>{selectedCrop.plantingDate}</Text>
              </View>
              <View style={styles.overviewItem}>
                <Text style={styles.overviewLabel}>Area</Text>
                <Text style={styles.overviewValue}>{selectedCrop.area} acres</Text>
              </View>
            </View>
            <View style={styles.overviewRow}>
              <View style={styles.overviewItem}>
                <Text style={styles.overviewLabel}>Status</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedCrop.status) }]}>
                  <Text style={styles.statusText}>{selectedCrop.status}</Text>
                </View>
              </View>
              <View style={styles.overviewItem}>
                <Text style={styles.overviewLabel}>Expected Harvest</Text>
                <Text style={styles.overviewValue}>{selectedCrop.expectedHarvest}</Text>
              </View>
            </View>
          </View>

          {/* Activities */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Activities</Text>
              <TouchableOpacity style={styles.addButton}>
                <Plus size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            {selectedCrop.activities.map((activity, index) => (
              <View key={activity.id} style={styles.activityCard}>
                <View style={styles.activityHeader}>
                  {getActivityIcon(activity.type)}
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityDescription}>{activity.description}</Text>
                    <Text style={styles.activityDate}>{activity.date}</Text>
                  </View>
                  {activity.cost && (
                    <Text style={styles.activityCost}>₹{activity.cost}</Text>
                  )}
                </View>
                {activity.notes && (
                  <Text style={styles.activityNotes}>{activity.notes}</Text>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Crop Diary</Text>
          <Text style={styles.headerSubtitle}>Track your farming activities</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.addCropButton}
            onPress={() => setShowAddModal(true)}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <LanguageSwitcher
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{cropEntries.length}</Text>
            <Text style={styles.summaryLabel}>Active Crops</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              {cropEntries.reduce((total, crop) => total + crop.area, 0).toFixed(1)}
            </Text>
            <Text style={styles.summaryLabel}>Total Area (acres)</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              {cropEntries.reduce((total, crop) => total + crop.activities.length, 0)}
            </Text>
            <Text style={styles.summaryLabel}>Total Activities</Text>
          </View>
        </View>

        {/* Crop Entries */}
        <View style={styles.cropsSection}>
          <Text style={styles.sectionTitle}>Your Crops</Text>
          {cropEntries.map((crop) => (
            <CropCard 
              key={crop.id} 
              crop={crop} 
              onPress={() => handleCropPress(crop)}
            />
          ))}
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Farming Tips</Text>
          <Text style={styles.tipText}>• Record all activities immediately for accuracy</Text>
          <Text style={styles.tipText}>• Track costs to calculate profitability</Text>
          <Text style={styles.tipText}>• Monitor weather before scheduling activities</Text>
          <Text style={styles.tipText}>• Take photos to document crop progress</Text>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addCropButton: {
    backgroundColor: '#22C55E',
    padding: 8,
    borderRadius: 8,
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
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
  summaryNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#22C55E',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  cropsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  cropCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cropCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cropName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  cropVariety: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  cropDetails: {
    marginBottom: 12,
  },
  cropDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cropDetailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  lastActivity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  lastActivityText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  tipsCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
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
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
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
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  overviewItem: {
    flex: 1,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#22C55E',
    padding: 8,
    borderRadius: 8,
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  activityDate: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  activityCost: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22C55E',
  },
  activityNotes: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
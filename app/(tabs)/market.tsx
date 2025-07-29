import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, TrendingUp, TrendingDown, MapPin, RefreshCw as Refresh } from 'lucide-react-native';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import VoiceButton from '@/components/VoiceButton';

interface MarketPrice {
  commodity: string;
  variety: string;
  market: string;
  state: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  lastUpdated: string;
}

const mockMarketData: MarketPrice[] = [
  {
    commodity: 'Wheat',
    variety: 'Durum',
    market: 'Mandi Gobindgarh',
    state: 'Punjab',
    price: 2150,
    unit: 'quintal',
    trend: 'up',
    change: 50,
    lastUpdated: '2 hours ago',
  },
  {
    commodity: 'Rice',
    variety: 'Basmati',
    market: 'Karnal',
    state: 'Haryana',
    price: 4200,
    unit: 'quintal',
    trend: 'down',
    change: -100,
    lastUpdated: '1 hour ago',
  },
  {
    commodity: 'Tomato',
    variety: 'Local',
    market: 'Azadpur',
    state: 'Delhi',
    price: 3000,
    unit: 'quintal',
    trend: 'up',
    change: 200,
    lastUpdated: '30 min ago',
  },
  {
    commodity: 'Onion',
    variety: 'Red',
    market: 'Lasalgaon',
    state: 'Maharashtra',
    price: 1800,
    unit: 'quintal',
    trend: 'stable',
    change: 0,
    lastUpdated: '45 min ago',
  },
  {
    commodity: 'Cotton',
    variety: 'Medium Staple',
    market: 'Rajkot',
    state: 'Gujarat',
    price: 6500,
    unit: 'quintal',
    trend: 'up',
    change: 150,
    lastUpdated: '1 hour ago',
  },
];

interface PriceCardProps {
  data: MarketPrice;
}

function PriceCard({ data }: PriceCardProps) {
  const getTrendIcon = () => {
    if (data.trend === 'up') return <TrendingUp size={16} color="#22C55E" />;
    if (data.trend === 'down') return <TrendingDown size={16} color="#EF4444" />;
    return <View style={styles.stableTrend} />;
  };

  const getTrendColor = () => {
    if (data.trend === 'up') return '#22C55E';
    if (data.trend === 'down') return '#EF4444';
    return '#6B7280';
  };

  return (
    <TouchableOpacity style={styles.priceCard} activeOpacity={0.8}>
      <View style={styles.priceCardHeader}>
        <View>
          <Text style={styles.commodity}>{data.commodity}</Text>
          <Text style={styles.variety}>{data.variety}</Text>
        </View>
        <View style={styles.trendContainer}>
          {getTrendIcon()}
          <Text style={[styles.changeText, { color: getTrendColor() }]}>
            {data.change > 0 ? '+' : ''}{data.change}
          </Text>
        </View>
      </View>
      
      <Text style={styles.price}>₹{data.price.toLocaleString('en-IN')}</Text>
      <Text style={styles.unit}>per {data.unit}</Text>
      
      <View style={styles.locationContainer}>
        <MapPin size={14} color="#6B7280" />
        <Text style={styles.location}>{data.market}, {data.state}</Text>
      </View>
      
      <Text style={styles.lastUpdated}>Updated {data.lastUpdated}</Text>
    </TouchableOpacity>
  );
}

export default function MarketScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [marketData, setMarketData] = useState(mockMarketData);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // In real app, this would fetch fresh data from APMC/eNAM APIs
    }, 2000);
  };

  const filteredData = marketData.filter(item =>
    item.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Market Prices</Text>
          <Text style={styles.headerSubtitle}>Live APMC rates</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#22C55E" />
            ) : (
              <Refresh size={20} color="#22C55E" />
            )}
          </TouchableOpacity>
          <LanguageSwitcher
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        </View>
      </View>

      {/* Search and Voice */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search commodity, market, or state..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <VoiceButton onPress={() => console.log('Voice search')} />
      </View>

      {/* Market Data */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.pricesContainer}>
          {filteredData.map((item, index) => (
            <PriceCard key={index} data={item} />
          ))}
        </View>

        {/* API Information */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Data Sources</Text>
          <Text style={styles.infoText}>
            • Agricultural Produce Market Committee (APMC)
          </Text>
          <Text style={styles.infoText}>
            • National Agriculture Market (eNAM)
          </Text>
          <Text style={styles.infoText}>
            • State Agricultural Marketing Boards
          </Text>
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
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  pricesContainer: {
    padding: 16,
  },
  priceCard: {
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
  priceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  commodity: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  variety: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  stableTrend: {
    width: 16,
    height: 2,
    backgroundColor: '#6B7280',
    borderRadius: 1,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#22C55E',
    marginBottom: 2,
  },
  unit: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  infoSection: {
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
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
});
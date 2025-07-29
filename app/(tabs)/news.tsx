import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ExternalLink, Calendar, Tag, TrendingUp, CircleAlert as AlertCircle, FileText } from 'lucide-react-native';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'policy' | 'market' | 'technology' | 'weather' | 'schemes';
  date: string;
  source: string;
  readTime: string;
  imageUrl?: string;
  url?: string;
  importance: 'high' | 'medium' | 'low';
}

const mockNewsData: NewsItem[] = [
  {
    id: '1',
    title: 'New PM-KISAN Beneficiary List Released for 2025',
    summary: 'The government has released the 16th installment list for PM-KISAN scheme. Eligible farmers can check their status online and expect payments within 15 days.',
    category: 'schemes',
    date: '2025-01-18',
    source: 'Ministry of Agriculture',
    readTime: '3 min read',
    importance: 'high',
    imageUrl: 'https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    title: 'Wheat Prices Expected to Rise Due to Export Demand',
    summary: 'International demand for Indian wheat has increased significantly, leading to higher domestic prices. Farmers advised to hold stock for better rates.',
    category: 'market',
    date: '2025-01-17',
    source: 'Agricultural Market Intelligence',
    readTime: '5 min read',
    importance: 'high',
    imageUrl: 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '3',
    title: 'New Drone Technology for Precision Farming Subsidized',
    summary: 'Government announces 50% subsidy on agricultural drones for precision farming. Applications open for registered FPOs and progressive farmers.',
    category: 'technology',
    date: '2025-01-16',
    source: 'Department of Agriculture Technology',
    readTime: '4 min read',
    importance: 'medium',
    imageUrl: 'https://images.pexels.com/photos/442589/pexels-photo-442589.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '4',
    title: 'Monsoon Prediction 2025: Normal Rainfall Expected',
    summary: 'IMD predicts normal monsoon with 96-104% of long period average rainfall. Southwest monsoon likely to arrive on time in Kerala.',
    category: 'weather',
    date: '2025-01-15',
    source: 'India Meteorological Department',
    readTime: '6 min read',
    importance: 'medium',
    imageUrl: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '5',
    title: 'Organic Certification Made Easier with Online Portal',
    summary: 'New digital platform launched for organic certification process. Farmers can now apply and track certification status online, reducing paperwork.',
    category: 'policy',
    date: '2025-01-14',
    source: 'Agricultural Marketing Division',
    readTime: '3 min read',
    importance: 'low',
    imageUrl: 'https://images.pexels.com/photos/1459331/pexels-photo-1459331.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

const categories = [
  { key: 'all', label: 'All News', icon: <FileText size={16} color="#6B7280" /> },
  { key: 'schemes', label: 'Schemes', icon: <Tag size={16} color="#22C55E" /> },
  { key: 'market', label: 'Market', icon: <TrendingUp size={16} color="#3B82F6" /> },
  { key: 'policy', label: 'Policy', icon: <AlertCircle size={16} color="#8B5CF6" /> },
  { key: 'technology', label: 'Technology', icon: <FileText size={16} color="#F59E0B" /> },
  { key: 'weather', label: 'Weather', icon: <Calendar size={16} color="#06B6D4" /> },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'schemes': return '#22C55E';
    case 'market': return '#3B82F6';
    case 'policy': return '#8B5CF6';
    case 'technology': return '#F59E0B';
    case 'weather': return '#06B6D4';
    default: return '#6B7280';
  }
};

const getImportanceColor = (importance: string) => {
  switch (importance) {
    case 'high': return '#EF4444';
    case 'medium': return '#F59E0B';
    case 'low': return '#22C55E';
    default: return '#6B7280';
  }
};

interface NewsCardProps {
  news: NewsItem;
  onPress: () => void;
}

function NewsCard({ news, onPress }: NewsCardProps) {
  const categoryColor = getCategoryColor(news.category);
  const importanceColor = getImportanceColor(news.importance);

  return (
    <TouchableOpacity style={styles.newsCard} onPress={onPress} activeOpacity={0.8}>
      {news.imageUrl && (
        <Image source={{ uri: news.imageUrl }} style={styles.newsImage} />
      )}
      
      <View style={styles.newsContent}>
        <View style={styles.newsHeader}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
            <Text style={styles.categoryText}>{news.category}</Text>
          </View>
          <View style={[styles.importanceDot, { backgroundColor: importanceColor }]} />
        </View>
        
        <Text style={styles.newsTitle}>{news.title}</Text>
        <Text style={styles.newsSummary}>{news.summary}</Text>
        
        <View style={styles.newsFooter}>
          <View style={styles.newsMetadata}>
            <Text style={styles.newsSource}>{news.source}</Text>
            <Text style={styles.newsDate}>{news.date}</Text>
          </View>
          <Text style={styles.readTime}>{news.readTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function NewsScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newsData] = useState<NewsItem[]>(mockNewsData);

  const filteredNews = selectedCategory === 'all' 
    ? newsData 
    : newsData.filter(news => news.category === selectedCategory);

  const handleNewsPress = async (news: NewsItem) => {
    if (news.url) {
      try {
        await Linking.openURL(news.url);
      } catch (error) {
        console.error('Error opening URL:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Agriculture News</Text>
          <Text style={styles.headerSubtitle}>Latest updates & policies</Text>
        </View>
        <LanguageSwitcher
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
      </View>

      {/* Category Filter */}
      <View style={styles.categorySection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryScrollContent}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryButton,
                selectedCategory === category.key && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.key)}>
              {category.icon}
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category.key && styles.categoryButtonTextActive
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Featured News */}
        {filteredNews.length > 0 && filteredNews[0].importance === 'high' && (
          <View style={styles.featuredSection}>
            <Text style={styles.sectionTitle}>Featured</Text>
            <NewsCard 
              news={filteredNews[0]} 
              onPress={() => handleNewsPress(filteredNews[0])}
            />
          </View>
        )}

        {/* All News */}
        <View style={styles.newsSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'Latest News' : `${categories.find(c => c.key === selectedCategory)?.label} News`}
          </Text>
          {filteredNews.slice(filteredNews[0]?.importance === 'high' ? 1 : 0).map((news) => (
            <NewsCard 
              key={news.id} 
              news={news} 
              onPress={() => handleNewsPress(news)}
            />
          ))}
        </View>

        {/* Information Sources */}
        <View style={styles.sourcesCard}>
          <Text style={styles.sourcesTitle}>Trusted Sources</Text>
          <Text style={styles.sourceText}>• Ministry of Agriculture & Farmers Welfare</Text>
          <Text style={styles.sourceText}>• India Meteorological Department (IMD)</Text>
          <Text style={styles.sourceText}>• Agricultural Marketing Division</Text>
          <Text style={styles.sourceText}>• Krishi Vigyan Kendras (KVKs)</Text>
          <Text style={styles.sourceText}>• ICAR Research Institutes</Text>
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
  categorySection: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryScroll: {
    paddingVertical: 12,
  },
  categoryScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    gap: 6,
    minHeight: 40,
  },
  categoryButtonActive: {
    backgroundColor: '#22C55E',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  featuredSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  newsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  newsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  newsImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  newsContent: {
    padding: 16,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  importanceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 22,
  },
  newsSummary: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsMetadata: {
    flex: 1,
  },
  newsSource: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22C55E',
  },
  newsDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  readTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  sourcesCard: {
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
  sourcesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  sourceText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
    lineHeight: 20,
  },
});
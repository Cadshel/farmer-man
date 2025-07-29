import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Cloud, Sun, CloudRain, MapPin, Thermometer, Droplets, Wind, Eye, Gauge, Sunrise, Sunset, TriangleAlert as AlertTriangle, RefreshCw as Refresh } from 'lucide-react-native';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const { width } = Dimensions.get('window');

interface WeatherData {
  location: string;
  state: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  forecast: DayForecast[];
  alerts: WeatherAlert[];
}

interface DayForecast {
  day: string;
  date: string;
  high: number;
  low: number;
  condition: string;
  precipitation: number;
  icon: string;
}

interface WeatherAlert {
  type: 'warning' | 'watch' | 'advisory';
  title: string;
  description: string;
  validUntil: string;
}

const mockWeatherData: WeatherData = {
  location: 'Ludhiana',
  state: 'Punjab',
  temperature: 28,
  condition: 'Partly Cloudy',
  humidity: 65,
  windSpeed: 12,
  visibility: 8,
  pressure: 1013,
  uvIndex: 6,
  sunrise: '06:15 AM',
  sunset: '07:30 PM',
  forecast: [
    { day: 'Today', date: 'Jan 18', high: 28, low: 18, condition: 'Partly Cloudy', precipitation: 10, icon: 'cloud' },
    { day: 'Tomorrow', date: 'Jan 19', high: 25, low: 16, condition: 'Rainy', precipitation: 80, icon: 'rain' },
    { day: 'Saturday', date: 'Jan 20', high: 23, low: 14, condition: 'Heavy Rain', precipitation: 90, icon: 'rain' },
    { day: 'Sunday', date: 'Jan 21', high: 26, low: 17, condition: 'Cloudy', precipitation: 30, icon: 'cloud' },
    { day: 'Monday', date: 'Jan 22', high: 29, low: 19, condition: 'Sunny', precipitation: 5, icon: 'sun' },
    { day: 'Tuesday', date: 'Jan 23', high: 31, low: 21, condition: 'Sunny', precipitation: 0, icon: 'sun' },
    { day: 'Wednesday', date: 'Jan 24', high: 30, low: 20, condition: 'Partly Cloudy', precipitation: 15, icon: 'cloud' },
  ],
  alerts: [
    {
      type: 'warning',
      title: 'Heavy Rainfall Warning',
      description: 'Heavy to very heavy rainfall expected in the next 48 hours. Risk of waterlogging in low-lying areas.',
      validUntil: 'Jan 21, 2025 6:00 PM',
    }
  ]
};

const getWeatherIcon = (condition: string, size: number = 24) => {
  const iconColor = '#22C55E';
  switch (condition.toLowerCase()) {
    case 'sunny':
      return <Sun size={size} color="#F59E0B" />;
    case 'cloudy':
    case 'partly cloudy':
      return <Cloud size={size} color={iconColor} />;
    case 'rainy':
    case 'heavy rain':
      return <CloudRain size={size} color="#3B82F6" />;
    default:
      return <Cloud size={size} color={iconColor} />;
  }
};

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
}

function MetricCard({ icon, label, value, unit }: MetricCardProps) {
  return (
    <View style={styles.metricCard}>
      <View style={styles.metricIcon}>{icon}</View>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>
        {value} {unit && <Text style={styles.metricUnit}>{unit}</Text>}
      </Text>
    </View>
  );
}

interface ForecastCardProps {
  data: DayForecast;
}

function ForecastCard({ data }: ForecastCardProps) {
  return (
    <View style={styles.forecastCard}>
      <Text style={styles.forecastDay}>{data.day}</Text>
      <Text style={styles.forecastDate}>{data.date}</Text>
      <View style={styles.forecastIcon}>
        {getWeatherIcon(data.condition, 32)}
      </View>
      <Text style={styles.forecastCondition}>{data.condition}</Text>
      <View style={styles.forecastTemps}>
        <Text style={styles.forecastHigh}>{data.high}°</Text>
        <Text style={styles.forecastLow}>{data.low}°</Text>
      </View>
      <Text style={styles.forecastRain}>{data.precipitation}%</Text>
    </View>
  );
}

export default function WeatherScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [weatherData, setWeatherData] = useState<WeatherData>(mockWeatherData);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call to IMD (Indian Meteorological Department)
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Weather Forecast</Text>
          <View style={styles.locationContainer}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.location}>{weatherData.location}, {weatherData.state}</Text>
          </View>
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

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Weather Alerts */}
        {weatherData.alerts.length > 0 && (
          <View style={styles.alertsSection}>
            {weatherData.alerts.map((alert, index) => (
              <View key={index} style={[styles.alertCard, 
                alert.type === 'warning' && styles.warningAlert,
                alert.type === 'watch' && styles.watchAlert,
                alert.type === 'advisory' && styles.advisoryAlert
              ]}>
                <AlertTriangle size={24} color="#EF4444" />
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.alertDescription}>{alert.description}</Text>
                  <Text style={styles.alertValidity}>Valid until: {alert.validUntil}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Current Weather */}
        <View style={styles.currentWeatherCard}>
          <View style={styles.currentWeatherMain}>
            <View style={styles.currentTemperature}>
              <Text style={styles.temperatureValue}>{weatherData.temperature}°C</Text>
              <Text style={styles.weatherCondition}>{weatherData.condition}</Text>
            </View>
            <View style={styles.currentWeatherIcon}>
              {getWeatherIcon(weatherData.condition, 64)}
            </View>
          </View>
          
          <View style={styles.sunTimes}>
            <View style={styles.sunTimeItem}>
              <Sunrise size={16} color="#F59E0B" />
              <Text style={styles.sunTimeText}>Sunrise: {weatherData.sunrise}</Text>
            </View>
            <View style={styles.sunTimeItem}>
              <Sunset size={16} color="#F97316" />
              <Text style={styles.sunTimeText}>Sunset: {weatherData.sunset}</Text>
            </View>
          </View>
        </View>

        {/* Weather Metrics */}
        <View style={styles.metricsContainer}>
          <MetricCard
            icon={<Droplets size={20} color="#3B82F6" />}
            label="Humidity"
            value={weatherData.humidity.toString()}
            unit="%"
          />
          <MetricCard
            icon={<Wind size={20} color="#22C55E" />}
            label="Wind Speed"
            value={weatherData.windSpeed.toString()}
            unit="km/h"
          />
          <MetricCard
            icon={<Eye size={20} color="#6B7280" />}
            label="Visibility"
            value={weatherData.visibility.toString()}
            unit="km"
          />
          <MetricCard
            icon={<Gauge size={20} color="#8B5CF6" />}
            label="Pressure"
            value={weatherData.pressure.toString()}
            unit="hPa"
          />
          <MetricCard
            icon={<Sun size={20} color="#F59E0B" />}
            label="UV Index"
            value={weatherData.uvIndex.toString()}
          />
          <MetricCard
            icon={<Thermometer size={20} color="#EF4444" />}
            label="Feels Like"
            value={(weatherData.temperature + 2).toString()}
            unit="°C"
          />
        </View>

        {/* 7-Day Forecast */}
        <View style={styles.forecastSection}>
          <Text style={styles.sectionTitle}>7-Day Forecast</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastScroll}>
            {weatherData.forecast.map((day, index) => (
              <ForecastCard key={index} data={day} />
            ))}
          </ScrollView>
        </View>

        {/* Agricultural Advisory */}
        <View style={styles.advisoryCard}>
          <Text style={styles.advisoryTitle}>Agricultural Advisory</Text>
          <Text style={styles.advisoryText}>
            • Avoid irrigation for the next 2 days due to expected rainfall
          </Text>
          <Text style={styles.advisoryText}>
            • Cover sensitive crops to protect from heavy rain
          </Text>
          <Text style={styles.advisoryText}>
            • Ensure proper drainage in fields to prevent waterlogging
          </Text>
          <Text style={styles.advisoryText}>
            • Apply fungicide after rain stops to prevent diseases
          </Text>
        </View>

        {/* Data Source */}
        <View style={styles.sourceCard}>
          <Text style={styles.sourceTitle}>Data Source</Text>
          <Text style={styles.sourceText}>
            Weather data provided by India Meteorological Department (IMD)
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
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
  scrollView: {
    flex: 1,
  },
  alertsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  warningAlert: {
    borderLeftColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  watchAlert: {
    borderLeftColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  advisoryAlert: {
    borderLeftColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  alertContent: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  alertValidity: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  currentWeatherCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  currentWeatherMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  currentTemperature: {
    flex: 1,
  },
  temperatureValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1F2937',
  },
  weatherCondition: {
    fontSize: 18,
    color: '#6B7280',
    marginTop: 4,
  },
  currentWeatherIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  sunTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sunTimeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: (width - 48) / 3,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  metricIcon: {
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  metricUnit: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
  },
  forecastSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  forecastScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  forecastCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    width: 120,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  forecastDay: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  forecastDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  forecastIcon: {
    marginBottom: 8,
  },
  forecastCondition: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  forecastTemps: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  forecastHigh: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  forecastLow: {
    fontSize: 14,
    color: '#6B7280',
  },
  forecastRain: {
    fontSize: 12,
    color: '#3B82F6',
  },
  advisoryCard: {
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
  advisoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  advisoryText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  sourceCard: {
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
  sourceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  sourceText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
});
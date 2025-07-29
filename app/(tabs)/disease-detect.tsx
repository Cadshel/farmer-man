import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Camera, RotateCw, FlashlightOff as FlashOff, Slash as FlashOn, X, CircleCheck as CheckCircle } from 'lucide-react-native';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface DetectionResult {
  disease: string;
  confidence: number;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
}

const mockDetectionResult: DetectionResult = {
  disease: 'Tomato Late Blight',
  confidence: 87,
  symptoms: [
    'Dark, water-soaked spots on leaves',
    'White fungal growth on leaf undersides',
    'Brown lesions on stems and fruits',
    'Yellowing and wilting of affected areas'
  ],
  treatment: [
    'Apply copper-based fungicide',
    'Remove and destroy infected plant parts',
    'Improve air circulation around plants',
    'Reduce overhead watering'
  ],
  prevention: [
    'Plant resistant varieties',
    'Ensure proper spacing between plants',
    'Apply preventive fungicide sprays',
    'Avoid working with wet plants'
  ]
};

export default function DiseaseDetectionScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text>Camera permissions are loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Camera size={64} color="#6B7280" />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to help identify crop diseases from photos
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(!flash);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      setIsAnalyzing(true);
      try {
        // In real implementation, this would:
        // 1. Capture the image
        // 2. Send to TensorFlow Lite model
        // 3. Process with CNN/ResNet for disease detection
        // 4. Return results with confidence scores
        
        setTimeout(() => {
          setDetectionResult(mockDetectionResult);
          setIsAnalyzing(false);
          setShowCamera(false);
        }, 3000);
      } catch (error) {
        setIsAnalyzing(false);
        Alert.alert('Error', 'Failed to capture image');
      }
    }
  };

  const closeCamera = () => {
    setShowCamera(false);
    setDetectionResult(null);
  };

  if (showCamera) {
    return (
      <SafeAreaView style={styles.container}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          flash={flash ? 'on' : 'off'}>
          
          {/* Camera Header */}
          <View style={styles.cameraHeader}>
            <TouchableOpacity style={styles.cameraButton} onPress={closeCamera}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.cameraTitle}>Position crop leaf in frame</Text>
            <LanguageSwitcher
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </View>

          {/* Camera Overlay */}
          <View style={styles.cameraOverlay}>
            <View style={styles.focusFrame} />
            <Text style={styles.instructionText}>
              Ensure good lighting and focus on affected areas
            </Text>
          </View>

          {/* Camera Controls */}
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.cameraControlButton} onPress={toggleFlash}>
              {flash ? <FlashOn size={24} color="#FFFFFF" /> : <FlashOff size={24} color="#FFFFFF" />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.captureButton, isAnalyzing && styles.captureButtonDisabled]}
              onPress={takePicture}
              disabled={isAnalyzing}>
              {isAnalyzing ? (
                <Text style={styles.captureButtonText}>Analyzing...</Text>
              ) : (
                <Camera size={32} color="#FFFFFF" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cameraControlButton} onPress={toggleCameraFacing}>
              <RotateCw size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </CameraView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Disease Detection</Text>
          <Text style={styles.headerSubtitle}>AI-powered crop analysis</Text>
        </View>
        <LanguageSwitcher
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {!detectionResult ? (
          <View style={styles.startContainer}>
            <View style={styles.instructionCard}>
              <Camera size={64} color="#22C55E" />
              <Text style={styles.instructionTitle}>Crop Disease Detection</Text>
              <Text style={styles.instructionText}>
                Take a clear photo of affected crop leaves or fruits. Our AI will analyze and identify potential diseases with treatment recommendations.
              </Text>
              
              <TouchableOpacity 
                style={styles.startButton}
                onPress={() => setShowCamera(true)}>
                <Camera size={24} color="#FFFFFF" />
                <Text style={styles.startButtonText}>Start Camera</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>Photography Tips</Text>
              <Text style={styles.tipText}>• Ensure good natural lighting</Text>
              <Text style={styles.tipText}>• Focus on affected areas clearly</Text>
              <Text style={styles.tipText}>• Include healthy parts for comparison</Text>
              <Text style={styles.tipText}>• Avoid shadows and blur</Text>
            </View>
          </View>
        ) : (
          <View style={styles.resultContainer}>
            {/* Detection Result */}
            <View style={styles.resultHeader}>
              <CheckCircle size={32} color="#22C55E" />
              <View style={styles.resultTitleContainer}>
                <Text style={styles.diseaseTitle}>{detectionResult.disease}</Text>
                <Text style={styles.confidenceText}>
                  Confidence: {detectionResult.confidence}%
                </Text>
              </View>
            </View>

            {/* Symptoms */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Symptoms Identified</Text>
              {detectionResult.symptoms.map((symptom, index) => (
                <Text key={index} style={styles.listItem}>• {symptom}</Text>
              ))}
            </View>

            {/* Treatment */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Recommended Treatment</Text>
              {detectionResult.treatment.map((treatment, index) => (
                <Text key={index} style={styles.listItem}>• {treatment}</Text>
              ))}
            </View>

            {/* Prevention */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Prevention Measures</Text>
              {detectionResult.prevention.map((prevention, index) => (
                <Text key={index} style={styles.listItem}>• {prevention}</Text>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.newScanButton}
              onPress={() => {
                setDetectionResult(null);
                setShowCamera(true);
              }}>
              <Camera size={20} color="#FFFFFF" />
              <Text style={styles.newScanButtonText}>Scan Another Crop</Text>
            </TouchableOpacity>
          </View>
        )}
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
  scrollView: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    minHeight: 48,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  startContainer: {
    padding: 16,
  },
  instructionCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  instructionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: '#22C55E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    minHeight: 48,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsCard: {
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
  camera: {
    flex: 1,
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cameraButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 16,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  focusFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#22C55E',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    borderRadius: 8,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cameraControlButton: {
    padding: 12,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 56,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    minHeight: 64,
  },
  captureButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  captureButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    padding: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  resultTitleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  diseaseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  confidenceText: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: '600',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  listItem: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  newScanButton: {
    backgroundColor: '#22C55E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
    minHeight: 56,
  },
  newScanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
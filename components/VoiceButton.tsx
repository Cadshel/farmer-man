import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, View } from 'react-native';
import { Mic, MicOff } from 'lucide-react-native';

interface VoiceButtonProps {
  onPress: () => void;
  isListening?: boolean;
  size?: 'small' | 'large';
}

export default function VoiceButton({ onPress, isListening = false, size = 'small' }: VoiceButtonProps) {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onPress();
  };

  const buttonSize = size === 'large' ? 80 : 48;
  const iconSize = size === 'large' ? 32 : 20;

  return (
    <View style={styles.container}>
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              width: buttonSize,
              height: buttonSize,
              backgroundColor: isListening ? '#EF4444' : '#22C55E',
            }
          ]}
          onPress={handlePress}
          activeOpacity={0.8}>
          {isListening ? (
            <MicOff size={iconSize} color="#FFFFFF" />
          ) : (
            <Mic size={iconSize} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </Animated.View>
      {isListening && (
        <View style={styles.pulseContainer}>
          <View style={[styles.pulse, styles.pulse1]} />
          <View style={[styles.pulse, styles.pulse2]} />
          <View style={[styles.pulse, styles.pulse3]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pulseContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#EF4444',
    opacity: 0.6,
  },
  pulse1: {
    width: 100,
    height: 100,
  },
  pulse2: {
    width: 120,
    height: 120,
    opacity: 0.4,
  },
  pulse3: {
    width: 140,
    height: 140,
    opacity: 0.2,
  },
});
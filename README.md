# Kisan Saathi – Agricultural Assistance Application

**Kisan Saathi** is a mobile-first agricultural assistance platform developed to support Indian farmers with accessible, multilingual technology. Built using **React Native with Expo**, the app provides core tools to enhance agricultural productivity, market awareness, and disease management. This is the Minimum Viable Product (MVP) version intended as a robust foundation for future expansion into machine learning, offline support, and API integrations.

---

## Overview

Kisan Saathi addresses key challenges faced by Indian farmers by offering intuitive navigation, multi-language access, weather insights, a crop tracking system, market price data, news updates, and the base structure for AI-driven plant disease detection.

This application has been designed with a focus on usability in rural areas, targeting farmers with limited digital experience and varied language preferences.

---

## Core Features (Phase 1 – Expo Managed Workflow)

- **Tab-Based Navigation**: Simplified layout with icon-driven access to core sections.
- **Multilingual Interface**: Supports English and Hindi, with a framework prepared for seven Indian languages.
- **Camera Integration**: Basic setup implemented for future integration with disease detection models.
- **Weather Dashboard**: Displays localized weather data using device location.
- **Crop Diary**: Enables users to log farming activities and track crop progress.
- **Market Prices**: UI foundation created for integration with APMC/eNAM data.
- **News and Policy Updates**: Inform farmers about government schemes, updates, and agricultural news.
- **Voice Interaction (Prototype)**: Base structure in place for voice navigation and future speech recognition features.
- **Responsive Layout**: Optimized for smartphones with screen sizes between 4.5" and 6.5".

---

## User Interface and Accessibility Design

- **Accessible Touch Targets**: Minimum touch size of 48dp to ensure usability on small screens.
- **High-Contrast Color Palette**:
  - Agricultural Green: `#22C55E`
  - Earth Brown: `#A3620A`
  - Sky Blue: `#3B82F6`
- **Iconography**: Utilizes Lucide Icons optimized for agricultural contexts.
- **Language Switcher**: Permanently visible on all major screens.
- **Visual Feedback for Voice Input**: Prepared for integration with real-time voice processing.

---

## Technology Stack

| Component                 | Technology                       |
|---------------------------|----------------------------------|
| UI Framework              | React Native with Expo           |
| Navigation                | Expo Router                      |
| Camera Access             | `expo-camera`                    |
| Animation                 | `react-native-reanimated`        |
| Voice Interface (base)    | `@react-native-voice/voice` (planned) |
| Machine Learning (planned)| TensorFlow Lite                  |
| Offline Storage (planned) | SQLite                           |

---

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- Expo CLI (`npm install -g expo-cli`)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/kisan-saathi.git
cd kisan-saathi

# Install dependencies
npm install

# Start the development server
npx expo start

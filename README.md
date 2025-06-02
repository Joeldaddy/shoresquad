# 🌊 ShoreSquad - Beach Cleanup Community

**Rally your crew, track weather, and hit the next beach cleanup with our dope map app!**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-brightgreen.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

## 🎯 Project Overview

ShoreSquad is a Progressive Web App designed to mobilize young people for beach cleanups by combining weather tracking, interactive maps, and social features to make environmental action fun and connected.

### ✨ Key Features

- 🗺️ **Interactive Map**: Find beach cleanup events near you with real-time locations
- 🌤️ **Weather Integration**: Check current conditions and 3-day forecasts
- 👥 **Crew Management**: Build your cleanup crew and track collective impact
- 📱 **Mobile-First PWA**: Works offline and can be installed on any device
- 🎨 **Youth-Focused Design**: Modern, engaging UI designed for Gen Z
- ♿ **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

## 🎨 Design Philosophy

### Color Palette (Updated)
- **Primary Teal (#00796b)**: Ocean-inspired, environmental consciousness
- **Light Cyan (#e0f7fa)**: Clean, refreshing background
- **Accent Amber (#ffab40)**: Energetic call-to-action for young users
- **Dark Teal (#004d40)**: Professional, trustworthy text

### UX Principles
- **Mobile-First**: Designed primarily for smartphone users
- **High Contrast**: Ensures accessibility for all users
- **Large Touch Targets**: Minimum 44px for easy mobile interaction
- **Progressive Enhancement**: Works on all devices, enhanced on modern ones

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- Modern web browser
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ShoreSquad
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   - Navigate to `http://localhost:3000`
   - Or use VS Code Live Server extension

## 🏗️ Project Structure

```
ShoreSquad/
├── index.html              # Main HTML file with semantic structure
├── manifest.json           # PWA manifest for app installation
├── sw.js                   # Service worker for offline functionality
├── css/
│   └── styles.css          # Modern CSS with CSS Grid and Flexbox
├── js/
│   └── app.js              # Main application logic with ES6+ features
├── assets/
│   └── images/             # App icons and graphics
├── .vscode/
│   └── settings.json       # VS Code configuration with Live Server
└── .gitignore              # Git ignore file
```

## 💻 Technical Features

### JavaScript Capabilities
- **ES6+ Modern Syntax**: Classes, async/await, destructuring
- **Geolocation API**: Find nearby cleanup events
- **Leaflet Maps**: Interactive mapping with custom markers
- **Local Storage**: Persist user data and preferences
- **Service Workers**: Offline functionality and push notifications
- **Web Share API**: Native sharing on supported devices

### Progressive Web App Features
- **Offline Support**: Core functionality works without internet
- **App Installation**: Add to home screen on mobile devices
- **Push Notifications**: Alerts for new cleanup events
- **Background Sync**: Sync data when connection returns

### Accessibility Features
- **ARIA Labels**: Comprehensive screen reader support
- **Keyboard Navigation**: Full app accessible via keyboard
- **Skip Links**: Quick navigation for assistive technology
- **High Contrast Support**: Adapts to user preferences
- **Reduced Motion**: Respects user motion preferences

## 🌐 API Integration

### Weather API
Currently using mock data. To integrate real weather:
1. Get API key from OpenWeatherMap or similar service
2. Replace mock data in `updateWeather()` method
3. Add API key to environment variables

### Maps Integration
- Uses OpenStreetMap tiles (free)
- Leaflet.js for interactive mapping
- Geolocation for user positioning

## 📱 Mobile Features

### Touch Interactions
- Swipe gestures on map
- Pull-to-refresh functionality
- Touch-friendly button sizing

### Platform Integration
- iOS Safari meta tags
- Android theme colors
- Native app-like experience

## 🚀 Deployment

### GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select source branch (usually `main`)

### Live Server (Development)
1. Install Live Server VS Code extension
2. Right-click `index.html` and select "Open with Live Server"
3. App will open at `http://localhost:5500`

## 📈 Roadmap

### Phase 1 (Current)
- ✅ Basic map functionality
- ✅ Weather integration
- ✅ PWA features
- ✅ Mobile-responsive design

### Phase 2 (Future)
- 🔄 Real-time event creation
- 🔄 User authentication
- 🔄 Social media integration
- 🔄 Achievement system

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

**Made with 💚 for our oceans**
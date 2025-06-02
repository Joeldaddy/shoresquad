// ShoreSquad Application
class ShoreSquadApp {
    constructor() {
        this.map = null;
        this.userLocation = null;
        this.cleanupEvents = [];
        this.weatherData = null;
        this.userStats = {
            cleanupsJoined: 0,
            crewSize: 0,
            impactScore: 0
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeMap();
        this.loadUserStats();
        this.setupServiceWorker();
        
        // Load sample data
        this.loadSampleEvents();
    }

    setupEventListeners() {
        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
                menuToggle.setAttribute('aria-expanded', !isExpanded);
                navMenu.classList.toggle('active');
            });
        }

        // Quick action buttons
        document.getElementById('find-nearby')?.addEventListener('click', () => {
            this.findNearbyEvents();
        });

        document.getElementById('create-event')?.addEventListener('click', () => {
            this.showCreateEventModal();
        });

        document.getElementById('weather-check')?.addEventListener('click', () => {
            this.updateWeather();
        });

        // Location and map controls
        document.getElementById('use-location')?.addEventListener('click', () => {
            this.getUserLocation();
        });

        document.getElementById('location-search')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchLocation(e.target.value);
            }
        });

        // Crew actions
        document.getElementById('invite-friends')?.addEventListener('click', () => {
            this.shareApp();
        });

        document.getElementById('share-achievement')?.addEventListener('click', () => {
            this.shareAchievement();
        });

        document.getElementById('join-cleanup')?.addEventListener('click', () => {
            this.joinRandomEvent();
        });

        // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    async initializeMap() {
        try {
            const mapContainer = document.getElementById('map-container');
            const loading = document.getElementById('loading-map');
            
            if (!mapContainer) return;

            // Show loading
            loading?.setAttribute('aria-hidden', 'false');

            // Initialize Leaflet map
            this.map = L.map('map-container').setView([1.3521, 103.8198], 11); // Singapore default

            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(this.map);

            // Hide loading
            loading?.setAttribute('aria-hidden', 'true');

            // Try to get user location
            this.getUserLocation();

        } catch (error) {
            console.error('Map initialization failed:', error);
            this.showError('Failed to load map. Please refresh the page.');
        }
    }

    getUserLocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by this browser.');
            return;
        }

        const button = document.getElementById('use-location');
        if (button) {
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting location...';
            button.disabled = true;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                if (this.map) {
                    this.map.setView([this.userLocation.lat, this.userLocation.lng], 13);
                    
                    // Add user location marker
                    L.marker([this.userLocation.lat, this.userLocation.lng])
                        .addTo(this.map)
                        .bindPopup('Your location')
                        .openPopup();
                }

                this.findNearbyEvents();
                this.updateWeather();

                if (button) {
                    button.innerHTML = '<i class="fas fa-crosshairs"></i> Use My Location';
                    button.disabled = false;
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                this.showError('Unable to get your location. Please enable location services.');
                
                if (button) {
                    button.innerHTML = '<i class="fas fa-crosshairs"></i> Use My Location';
                    button.disabled = false;
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    }

    loadSampleEvents() {
        // Sample cleanup events data
        this.cleanupEvents = [
            {
                id: 1,
                name: "East Coast Beach Cleanup",
                lat: 1.3010,
                lng: 103.9273,
                date: "2025-06-15",
                time: "09:00",
                participants: 25,
                description: "Join us for a morning beach cleanup at East Coast Park!"
            },
            {
                id: 2,
                name: "Sentosa Cove Cleanup",
                lat: 1.2494,
                lng: 103.8303,
                date: "2025-06-20",
                time: "16:00",
                participants: 18,
                description: "Evening cleanup session at Sentosa Cove."
            },
            {
                id: 3,
                name: "Marina Bay Cleanup",
                lat: 1.2831,
                lng: 103.8607,
                date: "2025-06-25",
                time: "10:00",
                participants: 35,
                description: "Help keep Marina Bay clean and beautiful!"
            }
        ];

        this.displayEventsOnMap();
    }

    displayEventsOnMap() {
        if (!this.map) return;

        this.cleanupEvents.forEach(event => {
            const marker = L.marker([event.lat, event.lng])
                .addTo(this.map);

            const popupContent = `
                <div class="event-popup">
                    <h4>${event.name}</h4>
                    <p><i class="fas fa-calendar"></i> ${event.date} at ${event.time}</p>
                    <p><i class="fas fa-users"></i> ${event.participants} participants</p>
                    <p>${event.description}</p>
                    <button class="btn btn-primary" onclick="app.joinEvent(${event.id})">
                        Join Event
                    </button>
                </div>
            `;

            marker.bindPopup(popupContent);
        });
    }

    findNearbyEvents() {
        if (!this.userLocation) {
            this.getUserLocation();
            return;
        }

        // Simulate finding nearby events
        const nearbyEvents = this.cleanupEvents.filter(event => {
            const distance = this.calculateDistance(
                this.userLocation.lat,
                this.userLocation.lng,
                event.lat,
                event.lng
            );
            return distance < 20; // Within 20km
        });

        this.showNotification(`Found ${nearbyEvents.length} cleanup events near you!`, 'success');
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    async updateWeather() {
        const loading = document.getElementById('loading-weather');
        const weatherData = document.getElementById('weather-data');
        
        if (!this.userLocation) {
            this.showError('Please allow location access to get weather information.');
            return;
        }

        try {
            loading?.classList.remove('hidden');
            
            // Simulate weather API call (replace with real API)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const mockWeatherData = {
                current: {
                    temperature: 28,
                    description: 'Partly cloudy',
                    humidity: 75,
                    windSpeed: 12,
                    icon: 'fas fa-cloud-sun'
                },
                forecast: [
                    { day: 'Today', high: 30, low: 25, icon: 'fas fa-sun' },
                    { day: 'Tomorrow', high: 29, low: 24, icon: 'fas fa-cloud-sun' },
                    { day: 'Day 3', high: 27, low: 23, icon: 'fas fa-cloud-rain' }
                ]
            };

            this.displayWeather(mockWeatherData);
            
        } catch (error) {
            console.error('Weather update failed:', error);
            this.showError('Failed to load weather data.');
        } finally {
            loading?.classList.add('hidden');
        }
    }

    displayWeather(data) {
        const weatherData = document.getElementById('weather-data');
        const forecastData = document.getElementById('forecast-data');

        if (weatherData) {
            weatherData.innerHTML = `
                <div class="current-weather">
                    <div class="weather-main">
                        <i class="${data.current.icon}"></i>
                        <span class="temperature">${data.current.temperature}°C</span>
                    </div>
                    <p class="weather-description">${data.current.description}</p>
                    <div class="weather-details">
                        <span><i class="fas fa-tint"></i> ${data.current.humidity}% humidity</span>
                        <span><i class="fas fa-wind"></i> ${data.current.windSpeed} km/h wind</span>
                    </div>
                </div>
            `;
        }

        if (forecastData) {
            forecastData.innerHTML = data.forecast.map(day => `
                <div class="forecast-item">
                    <span class="forecast-day">${day.day}</span>
                    <i class="${day.icon}"></i>
                    <span class="forecast-temp">${day.high}°/${day.low}°</span>
                </div>
            `).join('');
        }
    }

    joinEvent(eventId) {
        const event = this.cleanupEvents.find(e => e.id === eventId);
        if (event) {
            this.userStats.cleanupsJoined++;
            this.userStats.impactScore += 10;
            this.updateUserStats();
            this.showNotification(`Successfully joined ${event.name}!`, 'success');
        }
    }

    joinRandomEvent() {
        if (this.cleanupEvents.length > 0) {
            const randomEvent = this.cleanupEvents[Math.floor(Math.random() * this.cleanupEvents.length)];
            this.joinEvent(randomEvent.id);
        }
    }

    loadUserStats() {
        const savedStats = localStorage.getItem('shoresquad-stats');
        if (savedStats) {
            this.userStats = JSON.parse(savedStats);
        }
        this.updateUserStats();
    }

    updateUserStats() {
        document.getElementById('cleanups-joined').textContent = this.userStats.cleanupsJoined;
        document.getElementById('crew-size').textContent = this.userStats.crewSize;
        document.getElementById('impact-score').textContent = this.userStats.impactScore;
        
        // Save to localStorage
        localStorage.setItem('shoresquad-stats', JSON.stringify(this.userStats));
    }

    async shareApp() {
        const shareData = {
            title: 'ShoreSquad',
            text: 'Join me on ShoreSquad - rally your crew for beach cleanups!',
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
                this.showNotification('Link copied to clipboard!', 'success');
            }
        } catch (error) {
            console.error('Share failed:', error);
        }
    }

    async shareAchievement() {
        const shareText = `I've joined ${this.userStats.cleanupsJoined} beach cleanups and earned ${this.userStats.impactScore} impact points on ShoreSquad! 🌊🧹 #ShoreSquad #BeachCleanup`;
        
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'My ShoreSquad Achievement',
                    text: shareText
                });
            } else {
                await navigator.clipboard.writeText(shareText);
                this.showNotification('Achievement copied to clipboard!', 'success');
            }
        } catch (error) {
            console.error('Share failed:', error);
        }
    }

    searchLocation(query) {
        if (!query.trim()) return;
        
        // Simulate location search (replace with real geocoding API)
        this.showNotification(`Searching for "${query}"...`, 'info');
        
        // Mock search result
        setTimeout(() => {
            if (this.map) {
                this.map.setView([1.3521, 103.8198], 13);
                this.showNotification(`Found location: ${query}`, 'success');
            }
        }, 1000);
    }

    showCreateEventModal() {
        this.showNotification('Create Event feature coming soon!', 'info');
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registered:', registration);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed:', error);
                });
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close" aria-label="Close notification">×</button>
        `;

        // Add styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    color: white;
                    z-index: 10000;
                    max-width: 300px;
                    animation: slideIn 0.3s ease;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1rem;
                }
                .notification-success { background-color: #4caf50; }
                .notification-error { background-color: #f44336; }
                .notification-info { background-color: #2196f3; }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 1.2rem;
                    padding: 0;
                    margin: 0;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ShoreSquadApp();
});

// Handle online/offline status
window.addEventListener('online', () => {
    window.app?.showNotification('Back online! 🌐', 'success');
});

window.addEventListener('offline', () => {
    window.app?.showNotification('You are offline. Some features may be limited.', 'info');
});
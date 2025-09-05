// Dashboard configuration
const CONFIG = {
    apiBaseUrl: window.location.origin,
    updateInterval: 5000, // 5 seconds
    maxDataPoints: 20,
    alertThresholds: {
        temperature: 30,
        humidity: 80,
        light: 1000
    }
};

// Global variables
let charts = {};
let lastReadings = {};
let startTime = new Date();
let dataPointCount = 0;

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    startDataPolling();
    startUptimeCounter();
    
    // Add initial activity log
    addActivityLog('Dashboard initialized');
});

// Initialize Chart.js charts
function initializeCharts() {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: false,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 6
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        elements: {
            point: {
                radius: 0,
                hoverRadius: 4
            },
            line: {
                tension: 0.4
            }
        },
        animation: {
            duration: 0
        }
    };

    // Temperature Chart
    charts.temperature = new Chart(
        document.getElementById('temperatureChart').getContext('2d'),
        {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Temperature (°C)',
                    data: [],
                    borderColor: 'rgb(220, 53, 69)',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    fill: true,
                    borderWidth: 2
                }]
            },
            options: chartOptions
        }
    );

    // Humidity Chart
    charts.humidity = new Chart(
        document.getElementById('humidityChart').getContext('2d'),
        {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Humidity (%)',
                    data: [],
                    borderColor: 'rgb(23, 162, 184)',
                    backgroundColor: 'rgba(23, 162, 184, 0.1)',
                    fill: true,
                    borderWidth: 2
                }]
            },
            options: chartOptions
        }
    );

    // Light Chart
    charts.light = new Chart(
        document.getElementById('lightChart').getContext('2d'),
        {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Light Level',
                    data: [],
                    borderColor: 'rgb(255, 193, 7)',
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    fill: true,
                    borderWidth: 2
                }]
            },
            options: chartOptions
        }
    );
}

// Start polling for data
function startDataPolling() {
    fetchLatestData(); // Initial fetch
    setInterval(fetchLatestData, CONFIG.updateInterval);
    setInterval(fetchHistoricalData, 30000); // Every 30 seconds
}

// Fetch latest sensor data
async function fetchLatestData() {
    try {
        const response = await fetch(`${CONFIG.apiBaseUrl}/api/data/latest`);
        const data = await response.json();
        
        if (data && data.temperature !== undefined) {
            updateDashboard(data);
            checkAlerts(data);
            dataPointCount++;
            updateDataPointCount();
        }
    } catch (error) {
        console.error('Error fetching latest data:', error);
        addActivityLog('Error fetching data: ' + error.message);
    }
}

// Fetch historical data for charts
async function fetchHistoricalData() {
    try {
        const response = await fetch(`${CONFIG.apiBaseUrl}/api/data?limit=${CONFIG.maxDataPoints}`);
        const historicalData = await response.json();
        
        if (historicalData && historicalData.length > 0) {
            updateCharts(historicalData);
        }
    } catch (error) {
        console.error('Error fetching historical data:', error);
    }
}

// Update dashboard with new data
function updateDashboard(data) {
    // Update current values
    document.getElementById('temperatureValue').textContent = data.temperature !== null ? data.temperature.toFixed(1) : '--';
    document.getElementById('humidityValue').textContent = data.humidity !== null ? data.humidity.toFixed(1) : '--';
    document.getElementById('lightValue').textContent = data.light_level || '--';
    
    // Update motion detection
    const motionElement = document.getElementById('motionValue');
    const motionStatus = document.getElementById('motionStatus');
    
    if (data.motion_detected) {
        motionElement.textContent = 'Detected';
        motionElement.style.color = '#dc3545';
        motionStatus.textContent = 'ACTIVE';
        motionStatus.className = 'badge motion-detected';
    } else {
        motionElement.textContent = 'None';
        motionElement.style.color = '#198754';
        motionStatus.textContent = 'INACTIVE';
        motionStatus.className = 'badge bg-success';
    }
    
    // Update trends
    updateTrendIndicators(data);
    
    // Update last update time
    document.getElementById('lastUpdate').textContent = 
        'Last update: ' + new Date().toLocaleTimeString();
    
    // Add to activity log
    addActivityLog(`New reading: ${data.temperature}°C, ${data.humidity}% humidity`);
}

// Update trend indicators
function updateTrendIndicators(data) {
    const trends = {
        temperature: calculateTrend(data.temperature, lastReadings.temperature),
        humidity: calculateTrend(data.humidity, lastReadings.humidity),
        light: calculateTrend(data.light_level, lastReadings.light_level)
    };
    
    // Update trend badges
    updateTrendBadge('tempTrend', trends.temperature, '°C');
    updateTrendBadge('humidityTrend', trends.humidity, '%');
    updateTrendBadge('lightTrend', trends.light, '');
    
    // Store current readings for next comparison
    lastReadings = data;
}

function calculateTrend(current, previous) {
    if (previous === undefined || current === null) return 'neutral';
    const diff = current - previous;
    if (diff > 0) return 'up';
    if (diff < 0) return 'down';
    return 'neutral';
}

function updateTrendBadge(elementId, trend, unit) {
    const element = document.getElementById(elementId);
    const trendIcons = {
        up: '↗',
        down: '↘',
        neutral: '→'
    };
    
    element.textContent = trendIcons[trend] + ' ' + trend;
    element.className = `badge trend-${trend}`;
}

// Update charts with historical data
function updateCharts(data) {
    const labels = data.map(item => new Date(item.created_at).toLocaleTimeString());
    const temperatures = data.map(item => item.temperature);
    const humidities = data.map(item => item.humidity);
    const lightLevels = data.map(item => item.light_level);
    
    // Update temperature chart
    charts.temperature.data.labels = labels;
    charts.temperature.data.datasets[0].data = temperatures;
    charts.temperature.update();
    
    // Update humidity chart
    charts.humidity.data.labels = labels;
    charts.humidity.data.datasets[0].data = humidities;
    charts.humidity.update();
    
    // Update light chart
    charts.light.data.labels = labels;
    charts.light.data.datasets[0].data = lightLevels;
    charts.light.update();
}

// Check for alert conditions
function checkAlerts(data) {
    const alerts = [];
    
    if (data.temperature > CONFIG.alertThresholds.temperature) {
        alerts.push(`High temperature: ${data.temperature}°C`);
    }
    
    if (data.humidity > CONFIG.alertThresholds.humidity) {
        alerts.push(`High humidity: ${data.humidity}%`);
    }
    
    if (data.light_level > CONFIG.alertThresholds.light) {
        alerts.push(`High light level: ${data.light_level}`);
    }
    
    if (data.motion_detected) {
        alerts.push('Motion detected in monitored area!');
    }
    
    if (alerts.length > 0) {
        showAlert(alerts.join(' | '));
    } else {
        hideAlert();
    }
}

// Show alert notification
function showAlert(message) {
    document.getElementById('alertMessage').textContent = message;
    document.getElementById('alertContainer').style.display = 'block';
    addActivityLog('ALERT: ' + message);
}

// Hide alert notification
function hideAlert() {
    document.getElementById('alertContainer').style.display = 'none';
}

// Update uptime counter
function startUptimeCounter() {
    setInterval(() => {
        const now = new Date();
        const uptime = Math.floor((now - startTime) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;
        
        document.getElementById('uptime').textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// Update data point count
function updateDataPointCount() {
    document.getElementById('dataPoints').textContent = dataPointCount.toLocaleString();
}

// Add message to activity log
function addActivityLog(message) {
    const logElement = document.getElementById('activityLog');
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.textContent = `[${timestamp}] ${message}`;
    logElement.prepend(logEntry);
    
    // Keep only the last 10 entries
    while (logElement.children.length > 10) {
        logElement.removeChild(logElement.lastChild);
    }
}

// Handle connection errors
function handleConnectionError(error) {
    console.error('Connection error:', error);
    addActivityLog('Connection error: ' + error.message);
    
    // Show offline indicator
    document.getElementById('lastUpdate').textContent = 'Last update: OFFLINE';
    document.getElementById('lastUpdate').className = 'badge bg-danger';
}

// Add error handling for fetch calls
const originalFetch = window.fetch;
window.fetch = async function(...args) {
    try {
        const response = await originalFetch(...args);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response;
    } catch (error) {
        handleConnectionError(error);
        throw error;
    }
};

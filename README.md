# IoT Environment Monitor

A real-time environmental monitoring system with Raspberry Pi sensors and a cloud dashboard.

## Features
- Real-time temperature, humidity, light, and motion monitoring
- Web dashboard with charts and alerts
- Secure data transmission
- Responsive design

## Hardware Setup
- Raspberry Pi 400
- DHT11 (Temperature/Humidity)
- PIR Sensor (Motion) 
- LDR (Light) with MCP3008 ADC
- Jumper wires and resistors

## Installation

### Raspberry Pi
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Configure
Copy `.env.example` to `.env` and add your:
- PubNub keys
- Database credentials
- Security settings

## Usage
1. Wire sensors according to Fritzing diagram
2. Run `python publisher.py` on Pi
3. Access dashboard at your server URL

**Note**: Configure all security settings before deployment. Keep credentials secure.

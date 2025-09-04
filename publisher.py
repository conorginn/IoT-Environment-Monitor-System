import time
import json
import os
from dotenv import load_dotenv
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
from utils.adc import MCP3008
from sensors.dht11_sensor import DHT11Sensor
import RPi.GPIO as GPIO

# Load environment variables
load_dotenv()

# GPIO setup
PIR_PIN = 17  # GPIO pin for PIR sensor
GPIO.setmode(GPIO.BCM)
GPIO.setup(PIR_PIN, GPIO.IN)

# Initialize sensors
adc = MCP3008()
dht11 = DHT11Sensor()

# PubNub configuration
pnconfig = PNConfiguration()
pnconfig.publish_key = os.getenv('PUBNUB_PUBLISH_KEY')
pnconfig.subscribe_key = os.getenv('PUBNUB_SUBSCRIBE_KEY')
pnconfig.auth_key = os.getenv('PUBNUB_AUTH_KEY')
pnconfig.cipher_key = os.getenv('PUBNUB_CIPHER_KEY')
pnconfig.uuid = "raspberry_pi_environment_sensor"

pubnub = PubNub(pnconfig)

def read_sensors():
    """Read all sensor values"""
    # Read DHT11 (temperature and humidity)
    temperature, humidity = dht11.read()
    
    # Read LDR via MCP3008 channel 0
    ldr_value, ldr_voltage = adc.read_channel(0)
    
    # Read PIR sensor
    motion_detected = GPIO.input(PIR_PIN)
    
    return {
        "temperature": temperature,
        "humidity": humidity,
        "light_level": ldr_value,
        "motion_detected": bool(motion_detected),
        "timestamp": int(time.time() * 1000)  # Current time in milliseconds
    }

def publish_data():
    """Read sensor data and publish to PubNub"""
    sensor_data = read_sensors()
    
    # Only publish if we have valid data
    if sensor_data["temperature"] is not None and sensor_data["humidity"] is not None:
        print(f"Publishing: {sensor_data}")
        
        # Publish the data
        pubnub.publish().channel(os.getenv('PUBNUB_CHANNEL')).message(sensor_data).sync()
    else:
        print("Failed to read sensor data, skipping publish")

if __name__ == "__main__":
    print("Starting environment sensor publisher...")
    
    try:
        while True:
            publish_data()
            time.sleep(30)  # Publish every 30 seconds
    except KeyboardInterrupt:
        print("Stopping publisher...")
    finally:
        GPIO.cleanup()

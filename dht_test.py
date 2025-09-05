import adafruit_dht
import board
import time

# Initialize the DHT22 sensor on GPIO4
dht_device = adafruit_dht.DHT22(board.D4)

try:
    # Try to read from the sensor
    temperature = dht_device.temperature
    humidity = dht_device.humidity
    
    if temperature is not None and humidity is not None:
        print(f"Temperature: {temperature:.1f}°C, Humidity: {humidity:.1f}%")
    else:
        print("Failed to read sensor data")
        
except RuntimeError as error:
    print(f"Error reading sensor: {error.args[0]}")
    
except Exception as error:
    print(f"Unexpected error: {error}")
    
finally:
    dht_device.exit()

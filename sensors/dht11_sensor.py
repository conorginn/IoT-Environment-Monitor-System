import adafruit_dht
import board
import time

class DHT11Sensor:
    def __init__(self, pin=board.D4):
        self.dht_device = adafruit_dht.DHT11(pin, use_pulseio=False)
        
    def read(self):
        """Read temperature and humidity from DHT11"""
        try:
            temperature = self.dht_device.temperature
            humidity = self.dht_device.humidity
            return temperature, humidity
        except RuntimeError as error:
            print(f"DHT11 Error: {error.args[0]}")
            return None, None
        except Exception as error:
            print(f"DHT11 Unexpected error: {error}")
            return None, None

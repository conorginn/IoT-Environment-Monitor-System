import adafruit_dht
import board
import time

class DHT22Sensor:
    def __init__(self, pin=board.D4):
        # Change DHT11 to DHT22
        self.dht_device = adafruit_dht.DHT22(pin, use_pulseio=False)
        
    def read(self):
        """Read temperature and humidity from DHT22"""
        try:
            temperature = self.dht_device.temperature
            humidity = self.dht_device.humidity
            return temperature, humidity
        except RuntimeError as error:
            print(f"DHT22 Error: {error.args[0]}")
            return None, None
        except Exception as error:
            print(f"DHT22 Unexpected error: {error}")
            return None, None

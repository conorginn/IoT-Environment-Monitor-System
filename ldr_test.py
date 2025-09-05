#!/usr/bin/env python3
import RPi.GPIO as GPIO
import time
import spidev

# For MCP3008 ADC (if using)
spi = spidev.SpiDev()
spi.open(0, 0)
spi.max_speed_hz = 1000000

def read_adc(channel):
    # Read SPI data from MCP3008 chip, 8 possible adc's (0-7)
    if channel < 0 or channel > 7:
        return -1
    adc = spi.xfer2([1, (8 + channel) << 4, 0])
    data = ((adc[1] & 3) << 8) + adc[2]
    return data

print("Light Sensor Test")
print("-----------------")

try:
    while True:
        light_value = read_adc(0)  # Assuming LDR is on channel 0
        print(f"Light value: {light_value}")
        time.sleep(1)
        
except KeyboardInterrupt:
    print("\nTest interrupted")
    
finally:
    spi.close()
    print("SPI closed")

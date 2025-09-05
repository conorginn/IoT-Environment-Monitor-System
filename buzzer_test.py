#!/usr/bin/env python3
import RPi.GPIO as GPIO
import time

# GPIO setup
BUZZER_PIN = 22  # Change to your buzzer pin
GPIO.setmode(GPIO.BCM)
GPIO.setup(BUZZER_PIN, GPIO.OUT)

print("Buzzer Test")
print("-----------")

try:
    # Create PWM instance with frequency
    pwm = GPIO.PWM(BUZZER_PIN, 1000)  # 1000 Hz frequency
    
    for i in range(3):
        print("Buzzer ON")
        pwm.start(50)  # 50% duty cycle
        time.sleep(0.5)
        print("Buzzer OFF")
        pwm.stop()
        time.sleep(0.5)
        
except KeyboardInterrupt:
    print("Test interrupted")
    
finally:
    pwm.stop()
    GPIO.cleanup()
    print("GPIO cleaned up")

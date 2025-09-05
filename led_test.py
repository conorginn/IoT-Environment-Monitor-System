import RPi.GPIO as GPIO
import time

LED_PIN = 18  # GPIO 18 (Physical Pin 12)

GPIO.setmode(GPIO.BCM)
GPIO.setup(LED_PIN, GPIO.OUT)

try:
    print("Testing LED - should blink 5 times")
    for i in range(5):
        GPIO.output(LED_PIN, GPIO.HIGH)  # LED ON
        time.sleep(0.5)
        GPIO.output(LED_PIN, GPIO.LOW)   # LED OFF
        time.sleep(0.5)
    print("Test completed!")
    
finally:
    GPIO.cleanup()  # Always cleanup

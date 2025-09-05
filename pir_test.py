#!/usr/bin/env python3
import RPi.GPIO as GPIO
import time

# GPIO setup
PIR_PIN = 4  # Change this to the GPIO pin you're using for the PIR sensor
GPIO.setmode(GPIO.BCM)
GPIO.setup(PIR_PIN, GPIO.IN)

print("PIR Motion Sensor Test")
print("----------------------")
print("Sensor warming up... (waiting 30 seconds)")
time.sleep(30)  # PIR sensors need time to stabilize
print("Ready!")

# Variables to track motion
motion_count = 0
last_motion_time = time.time()

def motion_detected(channel):
    global motion_count, last_motion_time
    motion_count += 1
    last_motion_time = time.time()
    print(f"Motion detected! ({motion_count} detections)")

# Add event detector for the PIR pin
GPIO.add_event_detect(PIR_PIN, GPIO.RISING, callback=motion_detected)

try:
    print("Monitoring for motion... (Press Ctrl+C to stop)")
    while True:
        # Display status every 10 seconds
        time_since_last_motion = time.time() - last_motion_time
        print(f"Status: {motion_count} detections | Last motion: {time_since_last_motion:.1f} seconds ago", end='\r')
        time.sleep(0.1)
        
except KeyboardInterrupt:
    print("\n\nTest stopped by user")
    
finally:
    GPIO.cleanup()
    print(f"Total motion detections: {motion_count}")
    print("GPIO cleaned up")

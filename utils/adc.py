import busio
import digitalio
import board
from adafruit_mcp3xxx.mcp3008 import MCP3008 as MCP3008_ADC
from adafruit_mcp3xxx.analog_in import AnalogIn

class MCP3008:
    def __init__(self):
        # Create the SPI bus
        self.spi = busio.SPI(clock=board.SCK, MISO=board.MISO, MOSI=board.MOSI)
        
        # Create the chip select (cs) signal
        self.cs = digitalio.DigitalInOut(board.D8)  # Using GPIO 8 (CE0)
        
        # Create the MCP3008 object
        self.mcp = MCP3008_ADC(self.spi, self.cs)
        
    def read_channel(self, channel):
        """Read value from specified channel (0-7)"""
        chan = AnalogIn(self.mcp, channel)
        return chan.value, chan.voltage

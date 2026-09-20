import time
import json
import random
import math
import paho.mqtt.client as mqtt

BROKER = "broker.emqx.io"
PORT = 1883
TOPIC_TELEMETRY = "pest_defense/sensors/data"
TOPIC_DETERRENT = "pest_defense/deterrent/command"

class ESP32PodSimulator:
    def __init__(self):
        self.client_id = f"esp32_pod_sim_{int(time.time())}"
        try:
            self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1, self.client_id)
        except AttributeError:
            self.client = mqtt.Client(self.client_id)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        
        # Initial sensor state (Warm humid environment favorable for pest incubation)
        self.temp = 27.5
        self.humidity = 72.0
        self.soil_moisture = 65.0
        
        self.deterrent_active = False
        self.deterrent_freq_khz = 25.0
        self.deterrent_strobe_hz = 10.0

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print(f"✅ [ESP32 Simulator] Connected to MQTT Broker ({BROKER}:{PORT})")
            self.client.subscribe(TOPIC_DETERRENT)
            print(f"📡 [ESP32 Simulator] Subscribed to command topic: '{TOPIC_DETERRENT}'")
        else:
            print(f"❌ [ESP32 Simulator] Connection failed with code {rc}")

    def on_message(self, client, userdata, msg):
        try:
            payload = json.loads(msg.payload.decode('utf-8'))
            self.deterrent_active = payload.get("active", False)
            self.deterrent_freq_khz = payload.get("frequency_khz", 25.0)
            self.deterrent_strobe_hz = payload.get("strobe_hz", 10.0)
            mode = payload.get("mode", "UNKNOWN")
            
            if self.deterrent_active:
                print(f"⚡ [ESP32 HARDWARE EVENT] Deterrent ACTIVATED! [{mode}] -> Piezo Buzzer: {self.deterrent_freq_khz} kHz | Strobe LED: {self.deterrent_strobe_hz} Hz")
            else:
                print(f"💤 [ESP32 HARDWARE EVENT] Deterrent DISARMED.")
        except Exception as e:
            print(f"⚠️ [ESP32 Simulator Error] Failed to parse command message: {e}")

    def run(self):
        print("==================================================")
        print("🌱 ESP32 Sensor Pod & Active Deterrent Simulator")
        print("==================================================")
        print(f"Connecting to broker.emqx.io...")
        
        try:
            self.client.connect(BROKER, PORT, 60)
            self.client.loop_start()
        except Exception as e:
            print(f"Connection failed: {e}")
            return
            
        step = 0
        try:
            while True:
                # Add natural microclimate fluctuations
                step += 0.1
                temp_fluctuation = math.sin(step * 0.2) * 1.5 + random.uniform(-0.3, 0.3)
                humidity_fluctuation = math.cos(step * 0.15) * 3.0 + random.uniform(-0.5, 0.5)
                soil_fluctuation = random.uniform(-0.2, 0.2)
                
                curr_temp = round(max(15.0, min(42.0, self.temp + temp_fluctuation)), 1)
                curr_hum = round(max(30.0, min(95.0, self.humidity + humidity_fluctuation)), 1)
                curr_soil = round(max(20.0, min(90.0, self.soil_moisture + soil_fluctuation)), 1)
                
                telemetry = {
                    "device_id": "ESP32_FIELD_POD_01",
                    "temperature": curr_temp,
                    "humidity": curr_hum,
                    "soil_moisture": curr_soil,
                    "battery_pct": 98.5,
                    "deterrent_status": "ACTIVE" if self.deterrent_active else "IDLE",
                    "timestamp": time.time()
                }
                
                payload_str = json.dumps(telemetry)
                self.client.publish(TOPIC_TELEMETRY, payload_str)
                print(f"📊 [Telemetry Sent] T: {curr_temp}°C | H: {curr_hum}% | Soil: {curr_soil}% | Deterrent: {'ON' if self.deterrent_active else 'OFF'}")
                
                time.sleep(3.0)
        except KeyboardInterrupt:
            print("\nStopping ESP32 Simulator...")
            self.client.loop_stop()
            self.client.disconnect()

if __name__ == "__main__":
    sim = ESP32PodSimulator()
    sim.run()

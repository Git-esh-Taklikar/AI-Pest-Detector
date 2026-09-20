import json
import time
import paho.mqtt.client as mqtt
from typing import Callable, Optional, Dict, Any

class MQTTManager:
    """
    MQTT Communication Bridge for EMQX Cloud Broker (broker.emqx.io:1883).
    Handles sensor telemetry subscription and active deterrent trigger publishing.
    """
    
    TOPIC_SENSOR_DATA = "pest_defense/sensors/data"
    TOPIC_DETERRENT_COMMAND = "pest_defense/deterrent/command"
    TOPIC_ALERTS = "pest_defense/alerts/data"

    def __init__(self, broker: str = "broker.emqx.io", port: int = 1883, client_id: str = "pest_defense_backend"):
        self.broker = broker
        self.port = port
        self.client_id = f"{client_id}_{int(time.time())}"
        try:
            self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1, self.client_id)
        except AttributeError:
            self.client = mqtt.Client(self.client_id)
        
        self.client.on_connect = self._on_connect
        self.client.on_message = self._on_message
        
        self.on_telemetry_callback: Optional[Callable[[Dict[str, Any]], None]] = None
        self.on_command_callback: Optional[Callable[[Dict[str, Any]], None]] = None
        self.latest_sensor_data = {
            "temperature": 26.5,
            "humidity": 68.0,
            "soil_moisture": 55.0,
            "timestamp": time.time()
        }
        self.connected = False

    def _on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print(f"[MQTT] Connected successfully to {self.broker}:{self.port}")
            self.connected = True
            # Subscribe to sensor stream & commands
            self.client.subscribe(self.TOPIC_SENSOR_DATA)
            self.client.subscribe(self.TOPIC_DETERRENT_COMMAND)
        else:
            print(f"[MQTT] Connection failed with status code: {rc}")
            self.connected = False

    def _on_message(self, client, userdata, msg):
        try:
            payload = json.loads(msg.payload.decode('utf-8'))
            topic = msg.topic
            
            if topic == self.TOPIC_SENSOR_DATA:
                self.latest_sensor_data = payload
                self.latest_sensor_data["timestamp"] = time.time()
                if self.on_telemetry_callback:
                    self.on_telemetry_callback(payload)
            elif topic == self.TOPIC_DETERRENT_COMMAND:
                if self.on_command_callback:
                    self.on_command_callback(payload)
        except Exception as e:
            print(f"[MQTT Error] Failed to parse message on topic {msg.topic}: {e}")

    def start(self):
        """Connect to broker and start loop asynchronously."""
        try:
            print(f"[MQTT] Connecting to {self.broker}:{self.port}...")
            self.client.connect_async(self.broker, self.port, keepalive=60)
            self.client.loop_start()
        except Exception as e:
            print(f"[MQTT Warning] Could not connect to MQTT broker: {e}")

    def publish_deterrent_trigger(self, active: bool, frequency_khz: float = 25.0, strobe_hz: float = 10.0, mode: str = "MANUAL"):
        """Publish command to trigger ultrasonic buzzer & strobe LED on ESP32 hardware."""
        payload = {
            "active": active,
            "frequency_khz": frequency_khz,
            "strobe_hz": strobe_hz,
            "mode": mode,
            "timestamp": time.time()
        }
        if self.connected:
            self.client.publish(self.TOPIC_DETERRENT_COMMAND, json.dumps(payload))
            print(f"[MQTT Published] Deterrent trigger command: {payload}")
        return payload

    def publish_alert(self, alert_data: Dict[str, Any]):
        """Publish high pest threat alert."""
        if self.connected:
            self.client.publish(self.TOPIC_ALERTS, json.dumps(alert_data))
            
    def stop(self):
        self.client.loop_stop()
        self.client.disconnect()

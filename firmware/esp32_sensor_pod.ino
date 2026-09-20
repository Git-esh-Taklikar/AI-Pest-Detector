/*
  AI & IoT Pest Detection & Defense System - Field Sensor Pod Firmware
  Board: ESP32 Dev Module
  
  Hardware Pinout:
  - DHT22 Temp & Humidity Sensor: GPIO 4
  - Capacitive Soil Moisture Sensor: GPIO 34 (ADC1_CH6)
  - Ultrasonic Piezo Buzzer: GPIO 18 (PWM / tone)
  - High-Intensity Strobe LED Module: GPIO 19
  
  MQTT Broker: broker.emqx.io:1883
  Topics:
    - Publish Telemetry: pest_defense/sensors/data
    - Subscribe Command:  pest_defense/deterrent/command
*/

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "DHT.h"

// Wi-Fi Configuration
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASS = "YOUR_WIFI_PASSWORD";

// MQTT Broker Configuration
const char* MQTT_BROKER = "broker.emqx.io";
const int   MQTT_PORT   = 1883;
const char* TOPIC_TELEMETRY = "pest_defense/sensors/data";
const char* TOPIC_DETERRENT = "pest_defense/deterrent/command";

// Hardware Pins
#define DHTPIN 4
#define DHTTYPE DHT22
#define SOIL_PIN 34
#define BUZZER_PIN 18
#define STROBE_LED_PIN 19

DHT dht(DHTPIN, DHTTYPE);
WiFiClient espClient;
PubSubClient mqttClient(espClient);

// Global State
bool deterrentActive = false;
float deterrentFreqKhz = 25.0; // 25 kHz Ultrasonic
float strobeHz = 10.0;          // 10 Hz Flash
unsigned long lastTelemetryTime = 0;
unsigned long lastStrobeTime = 0;
bool strobeState = LOW;

#define BUZZER_CHANNEL 0

void setupWifi() {
  delay(10);
  Serial.print("Connecting to Wi-Fi SSID: ");
  Serial.println(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < 20) {
    delay(500);
    Serial.print(".");
    retries++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ Wi-Fi Connected! IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n⚠️ Wi-Fi Connection Timeout. Please set WIFI_SSID and WIFI_PASS in esp32_sensor_pod.ino");
  }
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived on topic [");
  Serial.print(topic);
  Serial.print("]: ");
  
  StaticJsonDocument<512> doc;
  DeserializationError error = deserializeJson(doc, payload, length);
  
  if (error) {
    Serial.print("JSON Deserialization failed: ");
    Serial.println(error.c_str());
    return;
  }
  
  deterrentActive = doc["active"] | false;
  deterrentFreqKhz = doc["frequency_khz"] | 25.0;
  strobeHz = doc["strobe_hz"] | 10.0;
  
  if (deterrentActive) {
    Serial.println("⚡ [HARDWARE EVENT] ACTIVE DETERRENT TRIGGERED!");
    // Set up piezo tone (convert kHz to Hz)
    int freqHz = (int)(deterrentFreqKhz * 1000.0);
    #if defined(ESP32) && defined(SOC_LEDC_SUPPORTED)
      ledcWriteTone(BUZZER_CHANNEL, freqHz);
    #else
      tone(BUZZER_PIN, freqHz);
    #endif
  } else {
    Serial.println("💤 [HARDWARE EVENT] Deterrent Disarmed.");
    #if defined(ESP32) && defined(SOC_LEDC_SUPPORTED)
      ledcWriteTone(BUZZER_CHANNEL, 0);
    #else
      noTone(BUZZER_PIN);
    #endif
    digitalWrite(STROBE_LED_PIN, LOW);
  }
}

void reconnectMqtt() {
  while (!mqttClient.connected()) {
    String clientId = "ESP32_Pest_Pod_" + String(random(0xffff), HEX);
    Serial.print("Attempting MQTT connection to ");
    Serial.print(MQTT_BROKER);
    Serial.print("...");
    
    if (mqttClient.connect(clientId.c_str())) {
      Serial.println("CONNECTED!");
      mqttClient.subscribe(TOPIC_DETERRENT);
      Serial.print("Subscribed to: ");
      Serial.println(TOPIC_DETERRENT);
    } else {
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" Retrying in 5 seconds...");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(SOIL_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(STROBE_LED_PIN, OUTPUT);
  digitalWrite(STROBE_LED_PIN, LOW);

  #if defined(ESP32) && defined(SOC_LEDC_SUPPORTED)
    ledcSetup(BUZZER_CHANNEL, 2000, 8);
    ledcAttachPin(BUZZER_PIN, BUZZER_CHANNEL);
  #endif
  
  dht.begin();
  setupWifi();
  
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);
}

void loop() {
  if (!mqttClient.connected()) {
    reconnectMqtt();
  }
  mqttClient.loop();

  // Non-blocking Strobe LED logic when deterrent is active
  if (deterrentActive && strobeHz > 0) {
    unsigned long currentMillis = millis();
    unsigned long interval = (unsigned long)(1000.0 / (strobeHz * 2.0));
    if (currentMillis - lastStrobeTime >= interval) {
      lastStrobeTime = currentMillis;
      strobeState = !strobeState;
      digitalWrite(STROBE_LED_PIN, strobeState);
    }
  }

  // Publish sensor telemetry every 3 seconds
  unsigned long now = millis();
  if (now - lastTelemetryTime > 3000) {
    lastTelemetryTime = now;
    
    float t = dht.readTemperature();
    float h = dht.readHumidity();
    
    if (isnan(t)) t = 26.5; // fallback
    if (isnan(h)) h = 68.0; // fallback
    
    // Read capacitive soil moisture (analog 0-4095)
    int rawSoil = analogRead(SOIL_PIN);
    // Map raw ADC (Air ~ 3200, Water ~ 1400) to 0-100% moisture
    float soilMoisturePct = map(rawSoil, 3200, 1400, 0, 100);
    soilMoisturePct = constrain(soilMoisturePct, 0.0, 100.0);
    
    StaticJsonDocument<256> telemetryDoc;
    telemetryDoc["device_id"] = "ESP32_FIELD_POD_01";
    telemetryDoc["temperature"] = round(t * 10.0) / 10.0;
    telemetryDoc["humidity"] = round(h * 10.0) / 10.0;
    telemetryDoc["soil_moisture"] = round(soilMoisturePct * 10.0) / 10.0;
    telemetryDoc["deterrent_status"] = deterrentActive ? "ACTIVE" : "IDLE";
    
    char buffer[256];
    serializeJson(telemetryDoc, buffer);
    
    mqttClient.publish(TOPIC_TELEMETRY, buffer);
    Serial.print("Published Telemetry: ");
    Serial.println(buffer);
  }
}

# AGRI-SPEC | AI & IoT Powered Pest Detection & Agronomic Defense System

An automated end-to-end computer vision and hardware defense framework featuring real-time YOLOv8 pest & object detection, microclimate risk intelligence (DHT22 Temp/Humidity + Capacitive Soil Moisture), chemical-free active pest deterrence (Ultrasonic Piezo Emitter & Strobe Light), prescriptive spray calculator, and a modern field station web dashboard.

**Live Demo:**
https://git-esh-taklikar.github.io/AI-Pest-Detector/
---

## 🌾 Key Features

1. **Optical Field Diagnostic Station (YOLOv8 Vision Engine)**
   - Real-time video stream processing (Laptop Camera, RTSP feeds, crop image upload).
   - High-density reticle HUD with millimeter grid rulers, corner marks `[ + ]`, coordinate tags (`LOC: [X:142, Y:89]`), and monospace telemetry ribbons.
   - Bounding box localization, class breakdown, and confidence scoring.

2. **Crop Disease Identification & Botanical Ledger**
   - Automatically maps detected pests to associated crop diseases (*Aphids $\rightarrow$ Mosaic Virus*, *Caterpillars $\rightarrow$ Stem Borer*, *Beetles $\rightarrow$ Flea Beetle Leaf Spot*).
   - Specimen index cards with taxonomic nomenclature in italics (*Phytophthora infestans*, *Aphis gossypii*), pathology stages, and disease vector cycle diagrams.
   - Micro-Macro loupe comparison displaying cellular lesion texture alongside macro plant view.
   - Probability distribution breakdown with "Forward to Extension Officer" fallback.

3. **Prescriptive Spray & Chemical Calculator**
   - Calculates exact water volume and biopesticide/fungicide concentrate based on crop acreage, growth stage (*Vegetative / Flowering / Fruiting*), and formula type.
   - Integrated Pre-Harvest Safety Interval (WHP / PHI) compliance timers.
   - Agronomic Weather Integration bar evaluating wind speed and temperature for spray drift safety.

4. **Active Hardware Deterrent Unit (Chemical-Free Defense)**
   - High-frequency ultrasonic piezo buzzer ($18 - 40\text{ kHz}$) to distress insect acoustic receptors.
   - High-intensity strobe LED module ($1 - 25\text{ Hz}$) to disrupt nocturnal pests.
   - Automatic AI trigger mode & manual hardware override.

5. **ESP32 IoT Sensor Pod & MQTT Integration**
   - Microclimate telemetry sent via MQTT to `broker.emqx.io:1883` (TCP) and `ws://broker.emqx.io:8083/mqtt` (WebSockets).
   - Standard C++ Arduino firmware (`esp32_sensor_pod.ino`) and Python IoT Simulator (`iot_simulator.py`).

---

## 🛠️ Project Structure

```text
├── firmware/
│   └── esp32_sensor_pod.ino    # ESP32 C++ Arduino firmware for DHT22, Soil, Buzzer, Strobe LED
├── simulator/
│   └── iot_simulator.py        # Python ESP32 IoT Field Simulator (paho-mqtt)
├── server/
│   ├── main.py                 # FastAPI backend server & WebSocket endpoints
│   ├── yolo_detector.py        # Ultralytics YOLOv8 inference & bounding box HUD generator
│   ├── risk_engine.py          # Microclimate risk calculator & crop disease diagnosis
│   ├── mqtt_client.py          # Paho MQTT bridge for broker.emqx.io
│   ├── requirements.txt        # Python backend dependencies
│   └── tests/
│       └── test_backend.py     # Pytest unit test suite
├── frontend/
│   ├── index.html              # HTML shell with Fraunces & JetBrains Mono typography
│   ├── package.json            # React, Vite, Lucide icons, Recharts, MQTT WS dependencies
│   └── src/
│       ├── App.jsx             # Main dashboard controller
│       ├── index.css           # Agronomy slate CSS tokens & reticle HUD styles
│       └── components/
│           ├── Navbar.jsx           # Field station navigation header
│           ├── WeatherStrip.jsx     # Spray compliance weather bar
│           ├── VideoStream.jsx      # Reticle camera stream & YOLO HUD
│           ├── SensorPodGauge.jsx   # Microclimate dials & disease diagnosis banner
│           ├── BotanicalLedger.jsx  # Specimen index & vector cycle diagrams
│           ├── SprayCalculator.jsx  # Chemical dosage calculator & PHI timers
│           ├── DeterrentControl.jsx # Active ultrasonic & strobe LED repeller controls
│           └── AnalyticsLog.jsx     # Threat timeline chart & field event log
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+ and npm

### 1. Setup Backend Engine
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/pest-detection-defense-system.git
cd pest-detection-defense-system

# Create virtual environment and install dependencies
python3 -m venv venv
./venv/bin/pip install -r server/requirements.txt

# Launch FastAPI Backend Server
PYTHONPATH=. ./venv/bin/uvicorn server.main:app --host 0.0.0.0 --port 8000
```

### 2. Setup Web Dashboard
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Run IoT Field Simulator
```bash
./venv/bin/python simulator/iot_simulator.py
```

---

## 📡 ESP32 Hardware Pinout

| Hardware Module | ESP32 Pin | Function |
| :--- | :--- | :--- |
| **DHT22 Sensor** | GPIO 4 | Air Temp (°C) & Relative Humidity (%) |
| **Capacitive Soil Sensor** | GPIO 34 (ADC1_CH6) | Soil Moisture (%) |
| **Active Piezo Buzzer** | GPIO 18 (PWM LEDC 0) | High-Frequency Ultrasonic Tone ($18-40\text{ kHz}$) |
| **Strobe LED Module** | GPIO 19 | High-Intensity Flashing Light ($1-25\text{ Hz}$) |

---

## 🧪 License
Distributed under the MIT License.

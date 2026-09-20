import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import WeatherStrip from './components/WeatherStrip';
import VideoStream from './components/VideoStream';
import SensorPodGauge from './components/SensorPodGauge';
import BotanicalLedger from './components/BotanicalLedger';
import SprayCalculator from './components/SprayCalculator';
import DeterrentControl from './components/DeterrentControl';
import AnalyticsLog from './components/AnalyticsLog';
import mqtt from 'mqtt';

export default function App() {
  const [backendOnline, setBackendOnline] = useState(false);
  const [mqttConnected, setMqttConnected] = useState(false);
  const [yoloLoaded, setYoloLoaded] = useState(false);
  
  const [deterrentActive, setDeterrentActive] = useState(false);
  const [autoEnabled, setAutoEnabled] = useState(true);
  const [frequencyKhz, setFrequencyKhz] = useState(25.0);
  const [strobeHz, setStrobeHz] = useState(12.0);
  const [confThreshold, setConfThreshold] = useState(0.25);

  const [sensorData, setSensorData] = useState({
    temperature: 27.5,
    humidity: 72.0,
    soil_moisture: 64.0
  });

  const [riskInfo, setRiskInfo] = useState({
    risk_score: 55.0,
    risk_level: "MODERATE",
    disease_name: "Fungal Leaf Blight & Downy Mildew",
    symptoms: "Yellow/brown spots on leaves, white powdery fungus on undersides.",
    farmer_action: "Reduce irrigation, improve field airflow, and enable automatic sound/light defense."
  });

  const [lastDetection, setLastDetection] = useState({
    total_pests: 0,
    pest_breakdown: {},
    fps: 30.0,
    inference_ms: 55.6
  });

  const [timelineHistory, setTimelineHistory] = useState([]);
  const [alertLogs, setAlertLogs] = useState([
    {
      id: 1,
      type: "STATION_ONLINE",
      message: "AGRI-SPEC Optical Diagnostics Engine ONLINE. Connected to EMQX Field Link.",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  useEffect(() => {
    const client = mqtt.connect("ws://broker.emqx.io:8083/mqtt", {
      clientId: `agri_spec_web_${Math.random().toString(16).substring(2, 8)}`,
      clean: true,
      reconnectPeriod: 3000
    });

    client.on('connect', () => {
      setMqttConnected(true);
      client.subscribe("pest_defense/sensors/data");
      client.subscribe("pest_defense/deterrent/command");
    });

    client.on('message', (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        if (topic === "pest_defense/sensors/data") {
          setSensorData({
            temperature: payload.temperature || 27.5,
            humidity: payload.humidity || 72.0,
            soil_moisture: payload.soil_moisture || 64.0
          });
        } else if (topic === "pest_defense/deterrent/command") {
          setDeterrentActive(payload.active || false);
        }
      } catch (err) {
        console.error("MQTT parsing error:", err);
      }
    });

    client.on('error', () => setMqttConnected(false));

    return () => client.end();
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/status");
        if (res.ok) {
          const data = await res.json();
          setBackendOnline(true);
          setYoloLoaded(data.yolo_loaded);
          if (data.microclimate_risk) {
            setRiskInfo(data.microclimate_risk);
          }
        }
      } catch (e) {
        setBackendOnline(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTimelineHistory(prev => [
      ...prev.slice(-15),
      {
        time: nowStr,
        pests: lastDetection.total_pests || 0,
        risk: riskInfo.risk_score || 0
      }
    ]);
  }, [lastDetection, riskInfo]);

  const handleManualSensorChange = (field, val) => {
    const updated = { ...sensorData, [field]: val };
    setSensorData(updated);

    fetch("http://localhost:8000/api/status")
      .then(res => res.json())
      .then(data => {
        if (data.microclimate_risk) setRiskInfo(data.microclimate_risk);
      })
      .catch(() => {});
  };

  const handleTriggerDeterrent = async (active, freq, strobe, mode = "MANUAL") => {
    setDeterrentActive(active);

    try {
      await fetch("http://localhost:8000/api/deterrent/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          active: active,
          frequency_khz: freq,
          strobe_hz: strobe,
          mode: mode
        })
      });
    } catch (err) {
      console.warn("Trigger error:", err);
    }

    const actionText = active ? "ACTIVATED ⚡" : "DISARMED 🛡️";
    const newLog = {
      id: Date.now(),
      type: active ? "DETERRENT_ACTIVATED" : "DETERRENT_DISARMED",
      message: `Active Deterrent ${actionText} (${freq}kHz Acoustic, ${strobe}Hz Strobe)`,
      timestamp: new Date().toLocaleTimeString()
    };
    setAlertLogs(prev => [newLog, ...prev.slice(0, 19)]);
  };

  const handleDetectionUpdate = (metadata) => {
    setLastDetection(metadata);
  };

  return (
    <div className="min-h-screen bg-[#121513] text-[#e2e8f0] flex flex-col font-['Inter',sans-serif]">
      
      {/* Top Navbar */}
      <Navbar
        backendOnline={backendOnline}
        mqttConnected={mqttConnected}
        yoloLoaded={yoloLoaded}
        deterrentActive={deterrentActive}
        onEmergencyStop={() => handleTriggerDeterrent(false, frequencyKhz, strobeHz, "EMERGENCY_STOP")}
      />

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        
        {/* Weather Integration & Spray Condition Strip */}
        <WeatherStrip
          temp={sensorData.temperature}
          humidity={sensorData.humidity}
          windSpeed={8.5}
        />

        {/* Optical Vision Viewport & Crop Health Diagnostic Gauge */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VideoStream
            onDetectionUpdate={handleDetectionUpdate}
            confThreshold={confThreshold}
            setConfThreshold={setConfThreshold}
          />

          <SensorPodGauge
            sensorData={sensorData}
            riskInfo={riskInfo}
            onManualSensorChange={handleManualSensorChange}
          />
        </div>

        {/* Botanical Ledger & Specimen Index */}
        <BotanicalLedger
          detectionMeta={lastDetection}
        />

        {/* Prescriptive Spray Dosage & Chemical Calculator */}
        <SprayCalculator
          activeDisease={riskInfo.disease_name}
        />

        {/* Preventative Active Pest Emitter */}
        <DeterrentControl
          deterrentActive={deterrentActive}
          autoEnabled={autoEnabled}
          setAutoEnabled={setAutoEnabled}
          frequencyKhz={frequencyKhz}
          setFrequencyKhz={setFrequencyKhz}
          strobeHz={strobeHz}
          setStrobeHz={setStrobeHz}
          onTriggerDeterrent={handleTriggerDeterrent}
        />

        {/* Real-Time Analytics & System Log */}
        <AnalyticsLog
          historyData={timelineHistory}
          alertLogs={alertLogs}
        />

      </main>

      <footer className="border-t border-[#2a322c] py-4 px-6 text-center text-xs font-mono-spec text-slate-500">
        <p>AGRI-SPEC Field Diagnostic Station • Agronomic Vision, Botanical Taxonomy & Prescriptive Crop Defense System</p>
      </footer>

    </div>
  );
}

import cv2
import numpy as np
import asyncio
import json
import time
import base64
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, UploadFile, File, Form, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel

from server.yolo_detector import YOLODetector
from server.risk_engine import RiskEngine
from server.mqtt_client import MQTTManager

app = FastAPI(
    title="Pest Detection & Defense Engine",
    description="AI & IoT Powered Crop Defense System with YOLOv8 & Microclimate Risk Intelligence",
    version="1.0.0"
)

# Enable CORS for browser frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Engine Singletons
yolo_engine: Optional[YOLODetector] = None
mqtt_manager: Optional[MQTTManager] = None

# Active System State
system_state = {
    "auto_deterrent_enabled": True,
    "confidence_threshold": 0.25,
    "deterrent_active": False,
    "frequency_khz": 25.0,
    "strobe_hz": 12.0,
    "last_detection": {
        "total_pests": 0,
        "pest_breakdown": {},
        "fps": 0.0,
        "timestamp": time.time()
    },
    "sensor_telemetry": {
        "temperature": 27.5,
        "humidity": 72.0,
        "soil_moisture": 62.0,
        "timestamp": time.time()
    },
    "alert_history": []
}

class ConnectedWebSockets:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

ws_manager = ConnectedWebSockets()

# Pydantic Request Models
class DeterrentRequest(BaseModel):
    active: bool
    frequency_khz: float = 25.0
    strobe_hz: float = 12.0
    mode: str = "MANUAL"

class SettingsRequest(BaseModel):
    auto_deterrent_enabled: bool
    confidence_threshold: float

@app.on_event("startup")
async def startup_event():
    global yolo_engine, mqtt_manager
    print("[Server Startup] Initializing YOLOv8 pest detector...")
    yolo_engine = YOLODetector(model_path="yolov8n.pt", conf_threshold=system_state["confidence_threshold"])
    
    print("[Server Startup] Connecting to MQTT broker (broker.emqx.io)...")
    mqtt_manager = MQTTManager()
    
    def on_telemetry(data: dict):
        system_state["sensor_telemetry"] = {
            "temperature": float(data.get("temperature", 25.0)),
            "humidity": float(data.get("humidity", 60.0)),
            "soil_moisture": float(data.get("soil_moisture", 50.0)),
            "timestamp": time.time()
        }
        
    mqtt_manager.on_telemetry_callback = on_telemetry
    mqtt_manager.start()
    print("[Server Startup] System initialization complete.")

@app.on_event("shutdown")
async def shutdown_event():
    if mqtt_manager:
        mqtt_manager.stop()

@app.get("/api/status")
def get_status():
    risk_info = RiskEngine.calculate_risk(
        system_state["sensor_telemetry"]["temperature"],
        system_state["sensor_telemetry"]["humidity"],
        system_state["sensor_telemetry"]["soil_moisture"]
    )
    return {
        "status": "ONLINE",
        "yolo_loaded": yolo_engine is not None,
        "mqtt_connected": mqtt_manager.connected if mqtt_manager else False,
        "system_state": system_state,
        "microclimate_risk": risk_info
    }

@app.post("/api/detect")
async def detect_pest_image(file: UploadFile = File(...), conf: float = 0.25):
    """Run YOLOv8 pest detection on an uploaded image file."""
    if not yolo_engine:
        raise HTTPException(status_code=500, detail="YOLO Engine not initialized")
    
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if frame is None:
        raise HTTPException(status_code=400, detail="Invalid image file format")
        
    annotated_frame, metadata = yolo_engine.detect_frame(frame, conf=conf)
    base64_img = yolo_engine.frame_to_base64(annotated_frame)
    
    # Update system detection state
    system_state["last_detection"] = metadata
    system_state["last_detection"]["timestamp"] = time.time()
    
    # Auto deterrent logic check
    risk_info = RiskEngine.calculate_risk(
        system_state["sensor_telemetry"]["temperature"],
        system_state["sensor_telemetry"]["humidity"],
        system_state["sensor_telemetry"]["soil_moisture"]
    )
    
    if system_state["auto_deterrent_enabled"] and (metadata["total_pests"] > 0 or risk_info["risk_score"] > 75.0):
        if not system_state["deterrent_active"]:
            system_state["deterrent_active"] = True
            if mqtt_manager:
                mqtt_manager.publish_deterrent_trigger(
                    active=True,
                    frequency_khz=system_state["frequency_khz"],
                    strobe_hz=system_state["strobe_hz"],
                    mode="AUTO_AI"
                )
            # Log alert
            alert_entry = {
                "id": int(time.time() * 1000),
                "type": "AUTO_DETERRENT_TRIGGERED",
                "message": f"Pest threat detected ({metadata['total_pests']} target pests). Active deterrent triggered!",
                "pest_count": metadata["total_pests"],
                "risk_score": risk_info["risk_score"],
                "timestamp": time.strftime("%H:%M:%S")
            }
            system_state["alert_history"].insert(0, alert_entry)
            system_state["alert_history"] = system_state["alert_history"][:20]
    
    return {
        "metadata": metadata,
        "annotated_image": f"data:image/jpeg;base64,{base64_img}",
        "risk_evaluation": risk_info
    }

@app.post("/api/deterrent/trigger")
def trigger_deterrent(req: DeterrentRequest):
    """Manually trigger or disarm active ultrasonic buzzer & strobe LED."""
    system_state["deterrent_active"] = req.active
    system_state["frequency_khz"] = req.frequency_khz
    system_state["strobe_hz"] = req.strobe_hz
    
    if mqtt_manager:
        mqtt_manager.publish_deterrent_trigger(
            active=req.active,
            frequency_khz=req.frequency_khz,
            strobe_hz=req.strobe_hz,
            mode=req.mode
        )
        
    action_str = "ACTIVATED" if req.active else "DISARMED"
    alert_entry = {
        "id": int(time.time() * 1000),
        "type": "MANUAL_OVERRIDE",
        "message": f"Active Deterrent {action_str} via Dashboard (Ultrasonic: {req.frequency_khz}kHz, Strobe: {req.strobe_hz}Hz)",
        "timestamp": time.strftime("%H:%M:%S")
    }
    system_state["alert_history"].insert(0, alert_entry)
    system_state["alert_history"] = system_state["alert_history"][:20]
    
    return {"status": "SUCCESS", "deterrent_active": req.active, "settings": req.dict()}

@app.post("/api/settings")
def update_settings(req: SettingsRequest):
    system_state["auto_deterrent_enabled"] = req.auto_deterrent_enabled
    system_state["confidence_threshold"] = req.confidence_threshold
    if yolo_engine:
        yolo_engine.conf_threshold = req.confidence_threshold
    return {"status": "SUCCESS", "settings": req.dict()}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            # Send periodic heartbeats & system state updates every 1 sec
            risk_info = RiskEngine.calculate_risk(
                system_state["sensor_telemetry"]["temperature"],
                system_state["sensor_telemetry"]["humidity"],
                system_state["sensor_telemetry"]["soil_moisture"]
            )
            payload = {
                "type": "TELEMETRY_UPDATE",
                "sensor_telemetry": system_state["sensor_telemetry"],
                "risk_info": risk_info,
                "deterrent_active": system_state["deterrent_active"],
                "auto_deterrent_enabled": system_state["auto_deterrent_enabled"],
                "last_detection": system_state["last_detection"],
                "alert_history": system_state["alert_history"]
            }
            await websocket.send_json(payload)
            await asyncio.sleep(1.0)
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception:
        ws_manager.disconnect(websocket)

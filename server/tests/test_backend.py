import pytest
import numpy as np
from server.risk_engine import RiskEngine
from server.yolo_detector import YOLODetector

def test_risk_engine_low_risk():
    # Low temp, low humidity -> Low pest risk
    res = RiskEngine.calculate_risk(temp=18.0, humidity=35.0, soil_moisture=30.0)
    assert res["risk_score"] < 40.0
    assert res["risk_level"] in ["LOW", "MODERATE"]

def test_risk_engine_critical_risk():
    # Warm temp (28°C optimal incubation) + High Humidity (88%) + High Soil Moisture (80%) -> High/Critical risk
    res = RiskEngine.calculate_risk(temp=28.0, humidity=88.0, soil_moisture=80.0)
    assert res["risk_score"] > 65.0
    assert res["risk_level"] in ["HIGH", "CRITICAL"]

def test_yolo_detector_initialization():
    # Test loading model and processing synthetic image
    detector = YOLODetector(model_path="yolov8n.pt", conf_threshold=0.25)
    dummy_frame = np.zeros((480, 640, 3), dtype=np.uint8)
    annotated_frame, metadata = detector.detect_frame(dummy_frame)
    
    assert annotated_frame is not None
    assert annotated_frame.shape == (480, 640, 3)
    assert "total_pests" in metadata
    assert "fps" in metadata

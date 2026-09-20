import cv2
import numpy as np
import time
import os
import base64
from ultralytics import YOLO

class YOLODetector:
    """
    YOLOv8 Pest & Object Detection Engine.
    Handles frame inference, bounding box overlay, pest count aggregation,
    and fallback pest mapping for agriculture applications.
    """
    
    # Agricultural Pest Mapping & Color Coding (BGR)
    PEST_COLORS = {
        "Aphid": (0, 255, 127),        # Spring Green
        "Caterpillar": (0, 215, 255),  # Gold
        "Beetle": (255, 191, 0),       # Deep Sky Blue
        "Locust": (0, 69, 255),        # Orange Red
        "Moth": (226, 43, 138),        # Blue Violet
        "Insect": (0, 255, 255),       # Yellow
        "Pest": (50, 50, 255)          # Bright Red
    }
    
    # Common object to crop pest mapping
    COCO_PEST_MAP = {
        "bird": "Locust",
        "cat": "Beetle",
        "dog": "Caterpillar",
        "apple": "Aphid",
        "orange": "Beetle",
        "broccoli": "Caterpillar",
        "cell phone": "Aphid",
        "cup": "Beetle",
        "mouse": "Insect",
        "remote": "Insect",
        "keyboard": "Locust"
    }

    # Pest to Crop Disease Mapping for Farmers
    PEST_DISEASE_MAP = {
        "Aphid": "Mosaic Virus & Sooty Mold",
        "Caterpillar": "Stem Borer & Leaf Defoliation",
        "Beetle": "Flea Beetle Leaf Spot",
        "Locust": "Locust Swarm Destruction",
        "Moth": "Armyworm & Fruit Damage",
        "Insect": "General Leaf Pests",
        "Pest": "Crop Pest Outbreak"
    }

    def __init__(self, model_path: str = "yolov8n.pt", conf_threshold: float = 0.25):
        self.conf_threshold = conf_threshold
        self.model_path = model_path
        print(f"[YOLO Engine] Loading model from {model_path}...")
        self.model = YOLO(model_path)
        print("[YOLO Engine] Model loaded successfully.")

    def detect_frame(self, frame: np.ndarray, conf: float = None):
        """
        Process a single image frame (BGR format from OpenCV) through YOLOv8.
        Returns (annotated_frame, metadata_dict).
        """
        if conf is None:
            conf = self.conf_threshold
            
        start_time = time.time()
        
        # Run inference
        results = self.model(frame, conf=conf, verbose=False)[0]
        
        annotated_frame = frame.copy()
        detections = []
        pest_counts = {}
        total_pests = 0
        
        # Extract bounding boxes
        for box in results.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            confidence = float(box.conf[0])
            cls_id = int(box.cls[0])
            raw_class_name = self.model.names[cls_id]
            
            # Map COCO classes to agriculture pest names if using default model
            pest_class = self.COCO_PEST_MAP.get(raw_class_name.lower(), raw_class_name.capitalize())
            
            pest_disease = self.PEST_DISEASE_MAP.get(pest_class, "Crop Threat")
            
            # Track count
            pest_counts[pest_class] = pest_counts.get(pest_class, 0) + 1
            total_pests += 1
            
            detections.append({
                "class_name": pest_class,
                "disease_risk": pest_disease,
                "confidence": round(confidence, 3),
                "bbox": [x1, y1, x2, y2]
            })
            
            # Select color based on pest class
            color = self.PEST_COLORS.get(pest_class, (0, 255, 0))
            
            # Draw glow & bounding box
            cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), color, 2)
            
            # Draw label banner
            label = f"{pest_class} {int(confidence * 100)}%"
            (label_w, label_h), baseline = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
            cv2.rectangle(annotated_frame, (x1, y1 - label_h - 6), (x1 + label_w + 6, y1), color, -1)
            cv2.putText(annotated_frame, label, (x1 + 3, y1 - 4), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
        
        inference_time_ms = round((time.time() - start_time) * 1000, 1)
        fps = round(1000.0 / max(inference_time_ms, 1.0), 1)
        
        # Overlay HUD metrics on top-left of frame
        hud_text = f"AI Pest Vision | Count: {total_pests} | FPS: {fps}"
        cv2.rectangle(annotated_frame, (10, 10), (320, 40), (15, 23, 42), -1)
        cv2.putText(annotated_frame, hud_text, (20, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (57, 255, 20), 1, cv2.LINE_AA)
        
        metadata = {
            "total_pests": total_pests,
            "pest_breakdown": pest_counts,
            "detections": detections,
            "fps": fps,
            "inference_ms": inference_time_ms
        }
        
        return annotated_frame, metadata

    def frame_to_base64(self, frame: np.ndarray) -> str:
        """Helper to convert BGR OpenCV image to JPEG base64 string for WebSocket transmission."""
        _, buffer = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
        return base64.b64encode(buffer).decode('utf-8')

import React, { useRef, useEffect, useState } from 'react';
import { Camera, Video, Upload, RefreshCw, Bug, Sliders, AlertCircle, Cpu, Crosshair } from 'lucide-react';

export default function VideoStream({ onDetectionUpdate, confThreshold, setConfThreshold }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streamSource, setStreamSource] = useState('webcam');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [annotatedImg, setAnnotatedImg] = useState(null);
  const [detectionMeta, setDetectionMeta] = useState({
    total_pests: 0,
    pest_breakdown: {},
    fps: 30.0,
    inference_ms: 55.6
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const PEST_DISEASE_MAP = {
    "Aphid": "Mosaic Virus & Sooty Mold Risk",
    "Caterpillar": "Leaf Defoliation & Stem Borer Damage",
    "Beetle": "Flea Beetle Leaf Spot & Wilt",
    "Locust": "Locust Swarm Defoliation Hazard",
    "Moth": "Armyworm & Fruit Borer Damage",
    "Insect": "Foliage Insect Pests"
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      console.warn("Camera access warning:", err);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (streamSource === 'webcam') startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [streamSource]);

  useEffect(() => {
    let intervalId;
    if (streamSource === 'webcam' && isCameraActive) {
      intervalId = setInterval(() => {
        captureAndDetect();
      }, 800);
    }
    return () => clearInterval(intervalId);
  }, [streamSource, isCameraActive, confThreshold]);

  const captureAndDetect = async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;
    
    const video = videoRef.current;
    if (video.readyState < 2) return;

    setIsProcessing(true);
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setIsProcessing(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', blob, 'frame.jpg');

      try {
        const response = await fetch(`http://localhost:8000/api/detect?conf=${confThreshold}`, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          setAnnotatedImg(data.annotated_image);
          setDetectionMeta(data.metadata);
          if (onDetectionUpdate) onDetectionUpdate(data.metadata);
        }
      } catch (err) {
        console.warn("Camera detection backend check:", err);
      } finally {
        setIsProcessing(false);
      }
    }, 'image/jpeg', 0.8);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`http://localhost:8000/api/detect?conf=${confThreshold}`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setAnnotatedImg(data.annotated_image);
        setDetectionMeta(data.metadata);
        if (onDetectionUpdate) onDetectionUpdate(data.metadata);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const primaryPest = Object.keys(detectionMeta.pest_breakdown || {})[0];
  const activeDisease = primaryPest ? PEST_DISEASE_MAP[primaryPest] || "Insect Crop Pest Damage" : null;

  return (
    <div className="field-panel rounded-xl p-5 border border-[#2a322c] flex flex-col gap-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#2a322c]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-[#4e8752]/15 text-[#4e8752] border border-[#4e8752]/30">
            <Crosshair className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 font-serif-botanical tracking-tight">Optical Field Diagnostic Station</h2>
            <p className="text-xs text-slate-400 font-mono-spec">RETICLE VISION HUD • YOLOv8-AGRI MODEL</p>
          </div>
        </div>

        {/* Source Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#121513] rounded-lg border border-[#2a322c] text-xs font-mono-spec">
          <button
            onClick={() => setStreamSource('webcam')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-all ${
              streamSource === 'webcam' ? 'bg-[#4e8752] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Live Feed
          </button>
          <button
            onClick={() => setStreamSource('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-all ${
              streamSource === 'upload' ? 'bg-[#4e8752] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Dropzone Specimen
          </button>
        </div>
      </div>

      {/* Reticle Viewport Container */}
      <div className="relative w-full aspect-video bg-[#000] rounded-lg overflow-hidden border border-[#2a322c] flex items-center justify-center">
        
        {/* Reticle Corner Marks [ + ] */}
        <div className="reticle-corner-tl"></div>
        <div className="reticle-corner-tr"></div>
        <div className="reticle-corner-bl"></div>
        <div className="reticle-corner-br"></div>

        {/* Millimeter Grid Rulers along Viewport Edges */}
        <div className="absolute top-0 left-0 right-0 ruler-x opacity-60"></div>
        <div className="absolute top-0 bottom-0 left-0 ruler-y opacity-60"></div>

        <video ref={videoRef} className="hidden" playsInline muted />
        <canvas ref={canvasRef} className="hidden" />

        {annotatedImg ? (
          <img src={annotatedImg} alt="Crop Camera Specimen Feed" className="w-full h-full object-contain" />
        ) : streamSource === 'webcam' && isCameraActive ? (
          <div className="text-center text-slate-400 flex flex-col items-center gap-2">
            <RefreshCw className="w-8 h-8 text-[#4e8752] animate-spin" />
            <p className="text-xs font-mono-spec">INITIALIZING OPTICAL FIELD MATRIX...</p>
          </div>
        ) : (
          <div className="text-center text-slate-400 p-6 flex flex-col items-center gap-2">
            <Camera className="w-10 h-10 text-[#708238]" />
            <p className="text-sm font-serif-botanical">Position leaf specimen inside optics reticle</p>
          </div>
        )}

        {/* Monospace Metadata Ribbon Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 font-mono-spec text-[10px]">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#121513]/90 border border-[#2a322c] text-slate-200">
            <span className="w-2 h-2 rounded-full bg-[#4e8752] animate-ping"></span>
            <span className="font-bold">OPTIC HUD: ACTIVE</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-[#121513]/90 border border-[#2a322c] text-slate-300">
            FPS: <span className="font-bold text-[#4e8752]">{detectionMeta.fps || '30.0'}</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-[#121513]/90 border border-[#2a322c] text-slate-300 hidden sm:block">
            LATENCY: <span className="font-bold text-[#d4b106]">{detectionMeta.inference_ms || '55.6'} ms</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-[#121513]/90 border border-[#2a322c] text-slate-300 hidden sm:block">
            RES: <span className="font-bold text-slate-200">640x480</span>
          </div>
        </div>

        {/* Spotted Pest Count Badge */}
        <div className="absolute top-3 right-3">
          <div className={`flex items-center gap-2 px-3 py-1 rounded font-mono-spec font-bold text-xs border ${
            detectionMeta.total_pests > 0 
              ? 'bg-[#241513] text-[#c84b31] border-[#c84b31] animate-pulse' 
              : 'bg-[#152219] text-[#4e8752] border-[#4e8752]'
          }`}>
            <Bug className="w-3.5 h-3.5" />
            <span>LOCATED TARGETS: {detectionMeta.total_pests}</span>
          </div>
        </div>

        {/* Target Bounding Box Coordinate Tag simulation on image */}
        {detectionMeta.total_pests > 0 && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-[#121513]/90 border border-[#2a322c] font-mono-spec text-[10px] text-[#4e8752]">
            TAG: LOC [X:142, Y:89] | CONF: 94.2% | CLASS: {primaryPest}
          </div>
        )}
      </div>

      {/* Reticle Dropzone Selector */}
      {streamSource === 'upload' && (
        <div className="p-4 rounded-lg bg-[#121513] border border-[#2a322c] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-300 font-mono-spec flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#708238]" />
            Drop image file [.JPG, .PNG] into reticle zone:
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-mono-spec file:font-semibold file:bg-[#4e8752] file:text-slate-950 hover:file:bg-[#708238] cursor-pointer"
          />
        </div>
      )}

      {/* Associated Disease Threat Identified */}
      {activeDisease && (
        <div className="p-3 rounded-lg bg-[#241513] border border-[#c84b31] flex items-center gap-3 text-xs">
          <AlertCircle className="w-5 h-5 text-[#c84b31] flex-shrink-0" />
          <div>
            <span className="text-[#c84b31] font-mono-spec font-bold uppercase tracking-wider block">Pathology Match Identified:</span>
            <span className="text-white font-serif-botanical font-bold text-sm">{activeDisease}</span>
          </div>
        </div>
      )}

      {/* Monospace Metadata Footer & Confidence Slider */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#2a322c] text-xs font-mono-spec">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-400">Class Tags:</span>
          {Object.keys(detectionMeta.pest_breakdown || {}).length > 0 ? (
            Object.entries(detectionMeta.pest_breakdown).map(([cls, count]) => (
              <span key={cls} className="px-2.5 py-1 rounded bg-[#121513] border border-[#4e8752]/40 text-[#4e8752] font-semibold flex items-center gap-1">
                <Bug className="w-3.5 h-3.5" />
                {cls.toUpperCase()}: {count}
              </span>
            ))
          ) : (
            <span className="text-slate-500 italic">No targets localized</span>
          )}
        </div>

        {/* Confidence Threshold Slider */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Sliders className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Conf Threshold:</span>
          <input
            type="range"
            min="0.1"
            max="0.8"
            step="0.05"
            value={confThreshold}
            onChange={(e) => setConfThreshold(parseFloat(e.target.value))}
            className="w-24 accent-[#4e8752] cursor-pointer"
          />
          <span className="font-bold text-[#4e8752] w-10 text-right">{Math.round(confThreshold * 100)}%</span>
        </div>
      </div>

    </div>
  );
}

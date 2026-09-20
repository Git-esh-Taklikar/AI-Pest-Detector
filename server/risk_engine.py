import math
from typing import Dict, Any

class RiskEngine:
    """
    Field Microclimate & Crop Disease Risk Assessment Engine.
    Evaluates temperature, relative humidity, and soil moisture telemetry
    to calculate disease threats, risk level, and farmer action advice.
    """
    
    @staticmethod
    def calculate_risk(temp: float, humidity: float, soil_moisture: float, pest_count: int = 0) -> Dict[str, Any]:
        """
        Calculate microclimate risk score and identify potential crop diseases.
        """
        # 1. Temperature Risk Factor (Gaussian curve centered around 28°C optimal incubation)
        temp_optimal = 28.0
        temp_sigma = 6.0
        temp_factor = math.exp(-0.5 * ((temp - temp_optimal) / temp_sigma) ** 2)
        
        # 2. Humidity Risk Factor (Fungal & bacterial leaf diseases thrive > 65% RH)
        if humidity < 40.0:
            humidity_factor = 0.2
        elif humidity < 60.0:
            humidity_factor = 0.5 + (humidity - 40.0) * 0.015
        elif humidity <= 85.0:
            humidity_factor = 0.8 + (humidity - 60.0) * 0.008
        else:
            humidity_factor = 1.0
            
        # 3. Soil Moisture Factor (Excessive moisture -> Root rot & wilt)
        if soil_moisture < 30.0:
            soil_factor = 0.3
        elif soil_moisture <= 75.0:
            soil_factor = 0.3 + (soil_moisture - 30.0) * 0.011
        else:
            soil_factor = 0.8 + (soil_moisture - 75.0) * 0.008
            
        # Weighted risk score
        weighted_score = (temp_factor * 0.40 + humidity_factor * 0.40 + soil_factor * 0.20) * 100.0
        
        # Boost risk score if live pests are spotted by camera
        if pest_count > 0:
            weighted_score = min(100.0, weighted_score + (pest_count * 8.0))

        risk_score = round(max(0.0, min(100.0, weighted_score)), 1)
        
        # Determine Disease Diagnosis based on microclimate & pest presence
        disease_name = "Healthy Crop Environment"
        symptoms = "No immediate crop disease symptoms predicted."
        farmer_action = "Maintain regular field inspection and soil monitoring."
        
        if humidity > 75.0 and temp > 24.0:
            disease_name = "Fungal Leaf Blight & Downy Mildew"
            symptoms = "Yellow/brown spots on leaves, white powdery fungus on undersides."
            farmer_action = "Reduce irrigation, improve field airflow, and enable automatic sound/light defense."
        elif humidity > 70.0 and soil_moisture > 75.0:
            disease_name = "Root Rot & Damping-Off Disease"
            symptoms = "Wilting stems, blackened roots, water-soaked foliage."
            farmer_action = "Pause watering immediately and clear field drainage channels."
        elif temp > 30.0 and humidity < 50.0:
            disease_name = "Heat Stress & Wilting Disease"
            symptoms = "Drooping leaves, leaf curl, stunted crop growth."
            farmer_action = "Provide light shade or evening watering to cool crop canopy."
        elif pest_count > 0:
            disease_name = "Insect-Vectored Crop Damage & Mosaic Virus"
            symptoms = "Chewed leaf edges, yellow mosaic spots, sap loss, stunted fruit."
            farmer_action = "Active pest defense triggered! Run sound & flashing light deterrent to clear pests."

        # Risk Level Category
        if risk_score < 35.0:
            risk_level = "LOW"
        elif risk_score < 65.0:
            risk_level = "MODERATE"
        elif risk_score < 85.0:
            risk_level = "HIGH"
        else:
            risk_level = "CRITICAL"
            
        return {
            "risk_score": risk_score,
            "risk_level": risk_level,
            "disease_name": disease_name,
            "symptoms": symptoms,
            "farmer_action": farmer_action,
            "factors": {
                "temperature": round(temp, 1),
                "humidity": round(humidity, 1),
                "soil_moisture": round(soil_moisture, 1)
            }
        }

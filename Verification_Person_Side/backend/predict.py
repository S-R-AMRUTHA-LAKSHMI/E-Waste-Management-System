from flask import Flask, request, jsonify
import pandas as pd
import joblib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the model when the server starts
model = joblib.load("ewaste_price_model1.pkl")

def calculate_final_amount(scrap_price, repair_cost, condition, age, resale_potential):
    """
    Calculate final amount ensuring it's higher than both scrap price and repair cost.
    Adjusts based on condition, age and resale potential.
    """
    # Base multiplier for final amount
    multipliers = {
        'Working': 2.5,
        'Partially Working': 1.8,
        'Non-Working': 1.3,
        'Scrap': 1.1
    }
    
    # Resale potential adjustments
    resale_adjustments = {
        'High': 0.5,
        'Medium': 0.3,
        'Low': 0.1
    }
    
    # Age adjustment (newer items get better prices)
    age_factor = max(0.5, 1 - (age / 15))  # 15 years as max age
    
    # Calculate base amount
    base_amount = max(scrap_price, repair_cost)
    
    # Apply multipliers
    condition_multiplier = multipliers.get(condition, 1.1)
    resale_adjustment = resale_adjustments.get(resale_potential, 0.1)
    
    # Calculate final amount
    final_amount = base_amount * (condition_multiplier + resale_adjustment) * (1 + age_factor)
    
    # Ensure minimum markup
    minimum_amount = max(scrap_price, repair_cost) * 1.1
    final_amount = max(final_amount, minimum_amount)
    
    return round(final_amount, 2)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # Create DataFrame with the expected features
        input_data = {
            "Item Type": data['itemType'],
            "Brand": data['brand'],
            "Age (Years)": float(data['age']),
            "Condition": data['condition'],
            "Weight (kg)": float(data['weight']),
            "Material Composition": data['materialComposition'],
            "Battery Included": data['batteryIncluded'],
            "Visible Damage": data['visibleDamage'],
            "Screen Condition": data['screenCondition'],
            "Rust Presence": data['rustPresence'],
            "Wiring Condition": data['wiringCondition'],
            "Resale Potential": data['resalePotential']
        }
        
        # Convert to DataFrame
        df = pd.DataFrame([input_data])
        
        # Make prediction
        prediction = model.predict(df)
        
        # Extract base predictions
        scrap_price = float(prediction[0][0])
        repair_cost = float(prediction[0][1])
        
        # Calculate adjusted final amount
        final_amount = calculate_final_amount(
            scrap_price,
            repair_cost,
            input_data["Condition"],
            input_data["Age (Years)"],
            input_data["Resale Potential"]
        )
        
        return jsonify({
            'scrapPrice': scrap_price,
            'repairCost': repair_cost,
            'finalAmount': final_amount
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(port=5001)